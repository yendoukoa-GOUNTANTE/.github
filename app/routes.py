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

from flask import Blueprint, render_template

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
    return render_template('affiliate_marketing.html')

@main_bp.route('/ads-optimization')
def ads_optimization():
    """Serves the ads optimization placeholder page."""
    return render_template('ads_optimization.html')

# We will register this blueprint in app/__init__.py
# No, I need to modify `app/__init__.py` to register this blueprint.
# The current plan step is "Initialize a simple Flask application."
# which includes creating a simple home page route in `app/routes.py`.
# The current content of `app/__init__.py` is:
# from flask import Flask
# def create_app():
#     app = Flask(__name__, instance_relative_config=True)
#     app.config.from_mapping(SECRET_KEY='dev')
#     with app.app_context():
#         from . import routes
#     return app

# This means `routes.py` is imported. If `routes.py` defines a blueprint,
# that blueprint needs to be registered with `app`.

# Let's ensure `app/__init__.py` registers this `main_bp` from `app/routes.py`.
# I will do that modification to `app/__init__.py` in the next tool call.
# This file `app/routes.py` is now complete for this step.
