from flask import render_template, current_app

# If we were using Blueprints, it would look something like:
# from flask import Blueprint
# bp = Blueprint('main', __name__)
# @bp.route('/')
# def index():
#     return render_template('index.html')

# For a simpler setup without Blueprints initially:
def register_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/affiliate-marketing')
    def affiliate_marketing():
        return render_template('affiliate_marketing.html')

    @app.route('/ads-optimization')
    def ads_optimization():
        return render_template('ads_optimization.html')

# This part is a bit tricky. The import in __init__.py for routes
# will execute this file. If create_app() is called multiple times (e.g. in tests)
# this could lead to issues if not handled carefully.
# A common pattern is to have a function like register_routes(app)
# and call it from within create_app(), or to use Blueprints.

# For now, let's adjust __init__.py to call register_routes.
# The current __init__.py structure is:
# with app.app_context():
#    from . import routes
# This means routes.py is imported, and any top-level code runs.
# To make this work with the function approach, we need to ensure
# current_app is available or pass the app instance.

# Let's modify __init__.py to pass the app object to a function in routes.py
# (This will be done in a subsequent step if needed, for now, the routes are defined
# but not yet registered in a way that `create_app` in `__init__.py` explicitly calls a registration function)

# The current __init__.py has `from . import routes` within `app.app_context()`.
# This will execute this routes.py file. To make routes available,
# they need to be associated with the app object.
# A simple way without blueprints for now, given the current __init__.py,
# is to get the app from current_app. However, routes should be defined
# when the app is being initialized.

# Let's refine the structure slightly.
# I will modify app/__init__.py to explicitly call a function from app/routes.py.

# For now, this file will define the routes. The registration
# will be ensured by how __init__.py imports and uses this module.
# The current import `from . import routes` in `__init__.py` is fine.
# The routes defined with `@app.route` will need an `app` object.
# This `app` object is `current_app` when a request is being handled,
# or the app instance when initially setting up routes.

# Let's assume `app` is available globally for simplicity here,
# or use `current_app.route` if appropriate within a request context,
# or better, use a blueprint or pass `app` to a setup function.

# Given the `__init__.py` structure:
# from flask import Flask
# def create_app():
#     app = Flask(__name__)
#     with app.app_context():
#         from . import routes # This line executes routes.py
#     return app
# We need to make sure routes.py can access `app`.

# Simplest way: routes.py uses current_app after it's pushed by app_context.
# However, @app.route is a decorator that needs `app` at definition time.

# Let's restructure app/routes.py and app/__init__.py for clarity.
# I will first write the routes.py file, then adjust __init__.py to call it.

from flask import Blueprint, render_template, session
from facebook_business.api import FacebookAdsApi
from facebook_business.exceptions import FacebookRequestError

# Create a Blueprint
# Blueprints are a way to organize a group of related routes and other code.
# Instead of registering routes and other code directly with an application,
# they are registered with a blueprint. Then the blueprint is registered with
# the application when it is available in a factory function.
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Serves the home page."""
    return render_template('index.html')

@main_bp.route('/affiliate-marketing')
def affiliate_marketing():
    """Serves the affiliate marketing placeholder page."""
    # Pass the stored data to the template
    return render_template('affiliate_marketing.html', affiliate_data=current_app.affiliate_data_store)

from .services import parse_affiliate_csv, parse_ad_campaign_csv, initialize_fb_api, get_fan_ad_placements_mock, get_fan_performance_data_mock

@main_bp.route('/ads-optimization', methods=['GET', 'POST']) # Added POST for refresh button
def ads_optimization():
    """Serves the ads optimization page, handles FAN data fetching."""
    fb_connected = False
    fan_placements = []
    fan_performance_data = []
    fb_error = None

    if 'fb_access_token' in session:
        fb_connected = True
        if not initialize_fb_api(session['fb_access_token']):
            fb_error = "Failed to initialize Facebook API. Token might be invalid or expired."
            # Potentially clear session token here if init fails consistently
            # session.pop('fb_access_token', None)
            # fb_connected = False

    if request.method == 'POST' and request.form.get('action') == 'fetch_fan_data':
        if fb_connected and not fb_error:
            try:
                # For now, using mock functions
                fan_placements = get_fan_ad_placements_mock()
                if fan_placements:
                    # Get performance for the IDs of the fetched mock placements
                    mock_placement_ids = [p['id'] for p in fan_placements]
                    fan_performance_data = get_fan_performance_data_mock(placement_ids=mock_placement_ids)
                flash('Mock FAN data refreshed!', 'info')
            except Exception as e:
                current_app.logger.error(f"Error fetching FAN data: {e}")
                flash(f"Error fetching FAN data: {str(e)}", 'danger')
                fb_error = str(e)
        elif fb_error:
             flash(f"Cannot fetch FAN data: {fb_error}", 'warning')
        else:
            flash('Please connect to Facebook Audience Network first.', 'warning')
        # Return to the same page, GET request will render the template with new data/errors
        # Using POST-Redirect-Get is often better but for a simple refresh, this can work.
        # Or, just let the GET part of the route handle rendering after POST.

    return render_template(
        'ads_optimization.html',
        ad_campaign_data=current_app.ad_campaign_data_store,
        fb_connected=fb_connected,
        fan_placements=fan_placements, # Will be empty on initial GET unless fetched by default
        fan_performance_data=fan_performance_data, # Same as above
        fb_error=fb_error
    )

@main_bp.route('/affiliate-marketing/upload-csv', methods=['GET', 'POST'])
def upload_affiliate_csv_route():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part', 'danger')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file', 'danger')
            return redirect(request.url)
        if file and file.filename.endswith('.csv'):
            try:
                # Read file content as string
                csv_content = file.stream.read().decode('utf-8')
                file_stream = io.StringIO(csv_content)

                # For Phase 1, we clear existing data before loading new.
                # A more advanced version might append, update, or handle duplicates.
                # current_app.affiliate_data_store.clear() # Optional: clear before new upload

                new_data, errors = parse_affiliate_csv(file_stream)

                if errors:
                    for error in errors:
                        flash(f'Error processing CSV: {error}', 'danger')

                if new_data:
                    current_app.affiliate_data_store.extend(new_data)
                    flash(f'Successfully uploaded and processed {len(new_data)} affiliate records.', 'success')
                elif not errors: # No new data and no errors means empty valid CSV or all rows skipped
                    flash('CSV processed, but no new valid data found or all rows had issues.', 'warning')

                return redirect(url_for('main.affiliate_marketing')) # Redirect to the dashboard
            except Exception as e:
                current_app.logger.error(f"Error processing affiliate CSV upload: {e}")
                flash(f'An unexpected error occurred: {e}', 'danger')
                return redirect(request.url)
        else:
            flash('Invalid file type. Please upload a .csv file.', 'danger')
            return redirect(request.url)

    return render_template('upload_affiliate_data.html')


from .services import parse_affiliate_csv, parse_ad_campaign_csv
from facebook_business.api import FacebookAdsApi
from facebook_business.exceptions import FacebookRequestError

# ... (other routes remain the same) ...

@main_bp.route('/connect-facebook-fan')
def connect_facebook_fan():
    """
    Initiates the OAuth 2.0 flow to connect with Facebook Audience Network.
    Redirects the user to Facebook's authorization page.
    """
    try:
        # These should be configured in your app settings (e.g., instance config or environment variables)
        # For now, directly from current_app.config
        app_id = current_app.config.get('FACEBOOK_APP_ID')
        app_secret = current_app.config.get('FACEBOOK_APP_SECRET')
        redirect_uri = current_app.config.get('FACEBOOK_REDIRECT_URI')

        if not app_id or 'YOUR_FACEBOOK_APP_ID' in app_id:
            flash('Facebook App ID not configured. Please set it up in the application settings.', 'danger')
            return redirect(url_for('main.ads_optimization'))

        # Scopes needed for Audience Network reporting
        # 'read_audience_network_insights' is key for FAN performance data.
        # 'ads_read' might be useful for accessing ad account info if placements are tied to ad accounts.
        # Check Facebook documentation for the most current and minimal required scopes.
        scopes = ['read_audience_network_insights', 'ads_read'] # Add other necessary scopes

        # The FacebookAdsApi.init is not strictly needed here for get_oauth_url,
        # but it's good practice if other API calls might be made before redirection or for consistency.
        # FacebookAdsApi.init(app_id=app_id, app_secret=app_secret) # Not initializing globally here

        oauth_url = FacebookAdsApi.get_oauth_url(
            app_id=app_id,
            redirect_uri=redirect_uri,
            scope=scopes
            # state= # Optional: for CSRF protection, generate and store a state value
        )
        current_app.logger.info(f"Redirecting to Facebook OAuth URL: {oauth_url}")
        return redirect(oauth_url)

    except Exception as e:
        current_app.logger.error(f"Error generating Facebook OAuth URL: {e}")
        flash(f'Error initiating Facebook connection: {str(e)}', 'danger')
        return redirect(url_for('main.ads_optimization'))

@main_bp.route('/ads-optimization/upload-csv', methods=['GET', 'POST'])
def upload_ad_csv_route():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part', 'danger')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file', 'danger')
            return redirect(request.url)
        if file and file.filename.endswith('.csv'):
            try:
                csv_content = file.stream.read().decode('utf-8')
                file_stream = io.StringIO(csv_content)

                # current_app.ad_campaign_data_store.clear() # Optional: clear before new upload

                new_data, errors = parse_ad_campaign_csv(file_stream)

                if errors:
                    for error in errors:
                        flash(f'Error processing CSV: {error}', 'danger')

                if new_data:
                    current_app.ad_campaign_data_store.extend(new_data)
                    flash(f'Successfully uploaded and processed {len(new_data)} ad campaign records.', 'success')
                elif not errors:
                     flash('CSV processed, but no new valid data found or all rows had issues.', 'warning')

                return redirect(url_for('main.ads_optimization')) # Redirect to the ad dashboard
            except Exception as e:
                current_app.logger.error(f"Error processing ad campaign CSV upload: {e}")
                flash(f'An unexpected error occurred: {e}', 'danger')
                return redirect(request.url)
        else:
            flash('Invalid file type. Please upload a .csv file.', 'danger')
            return redirect(request.url)

    return render_template('upload_ad_data.html')

@main_bp.route('/offline.html')
def offline_page():
    """Serves the offline fallback page."""
    return render_template('offline.html')

@main_bp.route('/sw.js')
def service_worker():
    """Serves the service worker file from the static folder but at root."""
    # Ensure the content type is correct.
    # send_from_directory handles ETag, caching headers, etc.
    return current_app.send_static_file('sw.js'), 200, {'Content-Type': 'application/javascript'}
    # Alternatively, if we want to set Service-Worker-Allowed for /static/sw.js:
    # response = current_app.send_static_file('sw.js')
    # response.headers['Service-Worker-Allowed'] = '/'
    # return response
