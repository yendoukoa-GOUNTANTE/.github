## Agent Instructions for AI Marketer Project

Welcome, Jules! This file provides guidance for working on the AI Marketer Agent project.

### Project Overview
The goal is to build a web application using Python (Flask) and HTML5 to provide affiliate marketing and ad optimization tools.

### Development Guidelines
1.  **Structure:**
    *   Flask app logic resides in the `app/` directory.
    *   `app/routes.py`: Defines URL routes and their corresponding controller functions.
    *   `app/services.py`: Contains the core business logic for optimization algorithms.
    *   `app/models.py`: For database models (if we add a database).
    *   `app/templates/`: Contains HTML templates. Use a `base.html` for common layout.
    *   `app/static/`: For CSS, JavaScript, and image files.
2.  **Flask:**
    *   Use Blueprints for organizing routes if the application grows complex.
    *   Follow Flask best practices for application structure and request handling.
3.  **HTML Templates:**
    *   Use template inheritance (e.g., `{% extends "base.html" %}`).
    *   Keep templates clean and focused on presentation. Logic should be in Python.
4.  **Python Code:**
    *   Write clean, readable, and well-commented Python code.
    *   Add type hints where appropriate.
    *   Business logic for optimizations should be in `app/services.py`.
5.  **Dependencies:**
    *   Manage Python dependencies in `requirements.txt`.
6.  **Testing:**
    *   Write unit tests for new functionality in the `tests/` directory. (We'll add this later)
7.  **Commits:**
    *   Write clear and concise commit messages.
8.  **Iteration:**
    *   We will build features iteratively. Focus on the current plan step.

### Initial Setup (Covered in Plan)
*   Flask app initialization.
*   Basic HTML templates (`base.html`, `index.html`, placeholders for feature pages).
*   Basic navigation.

### Next Steps (Anticipated)
*   Implementing specific optimization features, one by one.
*   Potentially adding a database to store campaign data, user settings, etc.
*   Developing more sophisticated UI/UX with CSS and JavaScript.

### PWA Development Considerations
*   **Service Worker (`sw.js`):**
    *   Located in `app/static/sw.js` but served from the root (`/sw.js`) via a Flask route.
    *   Responsible for caching strategies (defined in `urlsToCache`) and offline support.
    *   When updating cached assets (e.g., CSS, JS, HTML structure that are part of `urlsToCache`), or if the caching logic itself changes, remember to update the `CACHE_NAME` string in `sw.js`. This version change is crucial for the new service worker to replace the old one and for the `activate` event to clear out old caches containing outdated files.
*   **Manifest (`manifest.json`):**
    *   Located in `app/static/manifest.json`. Defines app metadata for PWA installation (name, icons, start URL, display mode, etc.).
*   **Offline Fallback Page:**
    *   `app/templates/offline.html` is the designated fallback page. It's served by a Flask route and must be included in the `urlsToCache` in `sw.js`.
*   **PWA Registration & HTML:**
    *   `app/templates/base.html` includes the link to `manifest.json` and the JavaScript to register the service worker. Ensure the service worker path and scope are correct here.
*   **Testing PWA Features:**
    *   Use browser developer tools extensively (Application tab -> Manifest, Service Workers, Cache Storage).
    *   Lighthouse PWA audits are very helpful for checking compliance and identifying issues.
    *   Thoroughly test offline scenarios: load pages, go offline, try to reload/navigate. Check that the offline page appears for non-cached/unavailable pages.
    *   Test PWA installation on various devices/platforms if possible.

Remember to refer to the plan and ask for clarification if anything is unclear! Good luck!
