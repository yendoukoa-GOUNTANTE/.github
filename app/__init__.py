from flask import Flask

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # A simple secret key for session management, etc.
    # In a real application, this should be a complex, random string
    # and ideally stored securely, e.g., in environment variables.
    app.config.from_mapping(
        SECRET_KEY='dev', # Replace with a real secret key in production
        FACEBOOK_APP_ID='YOUR_FACEBOOK_APP_ID', # Replace with your actual App ID
        FACEBOOK_APP_SECRET='YOUR_FACEBOOK_APP_SECRET', # Replace with your actual App Secret
        FACEBOOK_REDIRECT_URI='http://localhost:5000/fb_oauth_callback', # Ensure this matches FB App settings
    )

    # We can add configurations from a config.py file if needed
    # For example: app.config.from_object('config.Config')
    # Or load instance config, if it exists, when not testing
    # app.config.from_pyfile('config.py', silent=True)

    # Register Blueprints
    from . import routes
    app.register_blueprint(routes.main_bp)
    # Any other blueprints would be registered here as well.
    # For example:
    # from . import auth
    # app.register_blueprint(auth.bp)

    # It's common to make parts of the app available within the app context,
    # e.g. for initializing extensions, but routes are typically registered as above.
    # The `with app.app_context():` block is not strictly necessary for blueprint registration
    # if the import itself doesn't require an active app context (which `routes.main_bp` doesn't).

    # Initialize in-memory data stores for Phase 1
    # In a real app, this would be handled by a database or a more robust service layer.
    app.affiliate_data_store = []
    app.ad_campaign_data_store = []

    return app
