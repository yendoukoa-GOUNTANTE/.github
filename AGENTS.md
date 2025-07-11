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

Remember to refer to the plan and ask for clarification if anything is unclear! Good luck!
