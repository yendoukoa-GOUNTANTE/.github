# Conceptual Backend Proxy Server

This directory (`backend/`) contains a conceptual Node.js Express server designed to act as a backend proxy for the PWA's AI and Blockchain features. In a real-world application, this proxy would handle API key management, make requests to external AI/Blockchain services, and potentially manage more complex backend logic.

## Features

*   **Express Server**: A simple server built with Express.js.
*   **CORS Enabled**: Basic CORS (Cross-Origin Resource Sharing) is enabled to allow requests from the PWA (which might be served from a different domain/port during development or production).
*   **Placeholder API Endpoints**:
    *   `POST /api/ai-proxy`: Simulates forwarding a prompt to an AI service and returning a mock response.
    *   `POST /api/blockchain-proxy`: Simulates forwarding a query to a blockchain service/node and returning mock data.
*   **Dockerfile**: A `Dockerfile` is provided to containerize the Node.js application.
*   **Procfile**: For Heroku deployment.

## Files

*   `server.js`: The main Express application file with route definitions.
*   `package.json`: Node.js project manifest, including dependencies (Express, CORS) and engine versions.
*   `Procfile`: Specifies the command for Heroku to run the web process.
*   `Dockerfile`: Instructions to build a Docker image for the backend server.
*   `README.md`: This file.

## Setup and Running Locally

1.  **Prerequisites**:
    *   Node.js and npm installed.
    *   Docker installed (if you want to run it as a container).

2.  **Install Dependencies**:
    Navigate to the `pwa-ai-blockchain/backend/` directory in your terminal and run:
    ```bash
    npm install
    ```

3.  **Run the Server (Node.js directly)**:
    ```bash
    npm start
    ```
    The server will typically start on `http://localhost:3000`.

4.  **Run the Server (Docker)**:
    *   **Build the Docker image**:
        Navigate to the `pwa-ai-blockchain/backend/` directory and run:
        ```bash
        docker build -t pwa-backend-proxy .
        ```
    *   **Run the Docker container**:
        ```bash
        docker run -p 3000:3000 -d pwa-backend-proxy
        ```
        This maps port 3000 of the container to port 3000 on your host machine and runs it in detached mode. You can then access it at `http://localhost:3000`.

## Deploying to Heroku

This Node.js Express server can be easily deployed to Heroku.

1.  **Prerequisites**:
    *   [Heroku Account](https://signup.heroku.com/) (free tier available).
    *   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed and logged in (`heroku login`).
    *   [Git](https://git-scm.com/downloads) installed.
    *   Ensure your `backend/` directory is a Git repository or part_plan of a larger repository you intend to push. If it's part_plan of a larger mono-repo, deploying a subdirectory to Heroku might require buildpacks or other strategies (see Heroku documentation for deploying from subdirectories). For simplicity, these steps assume `backend/` is the root of the Git repository being pushed to Heroku or you are using a method to deploy a subdirectory.

2.  **Prepare for Heroku**:
    *   **`Procfile`**: This project includes a `Procfile` (`web: node server.js`) which tells Heroku how to run your web dyno. This is in the `backend/` directory.
    *   **`package.json`**:
        *   The `scripts.start` command (`node server.js`) is defined.
        *   The `engines` field specifies Node.js/npm versions; Heroku will try to match these.
    *   **Port**: The `server.js` uses `process.env.PORT || 3000`. Heroku sets the `PORT` environment variable automatically, so your app will listen on the correct port.

3.  **Deployment Steps (Assuming `backend/` is the root of your Git repo for Heroku)**:
    *   **Navigate to your backend directory**:
        ```bash
        cd path/to/your/pwa-ai-blockchain/backend
        ```
        If it's not already a Git repository:
        ```bash
        git init
        git add .
        git commit -m "Initial backend commit for Heroku"
        ```
    *   **Create a Heroku App**:
        ```bash
        heroku create your-unique-app-name # Or just 'heroku create' for a random name
        ```
        This command also adds a `heroku` remote to your Git configuration.
    *   **(Optional) Set Environment Variables**: If your application required environment variables (e.g., API keys like `AI_API_KEY`), you would set them now:
        ```bash
        heroku config:set MY_VARIABLE="some_value" ANOTHER_VARIABLE="another_value"
        ```
        *(This conceptual backend doesn't currently use custom env vars beyond PORT, which Heroku handles.)*
    *   **Deploy the Code**:
        Push your code to Heroku. If your current branch is `main` (or `master`):
        ```bash
        git push heroku main # Or 'git push heroku master'
        ```
        *(If your local branch has a different name, use `git push heroku your-local-branch-name:main`)*
    *   **Check Deployment Status & Logs**:
        Heroku will build and deploy your application. You can monitor the process:
        ```bash
        heroku logs --tail
        ```
    *   **Open Your App**:
        Once deployed, you can open it in your browser:
        ```bash
        heroku open
        ```
        The URL will be something like `https://your-unique-app-name.herokuapp.com`.

4.  **Troubleshooting**:
    *   Use `heroku logs --tail` extensively to diagnose issues.
    *   Ensure all runtime dependencies are listed in `dependencies` in `package.json` (not `devDependencies`).
    *   Check Node.js version compatibility if issues arise (Heroku build log will show version used).

## Integrating with the PWA

1.  Ensure this backend server is running (locally or on Heroku).
2.  Modify the PWA's `js/app.js` file:
    *   Update the `getMockAIResponse` function to make a `fetch` call to your backend URL (e.g., `https://your-unique-app-name.herokuapp.com/api/ai-proxy` or `http://localhost:3000/api/ai-proxy`).
    *   Update the `getMockBlockchainData` function similarly.
    *   Remember to send data in the `POST` request body as JSON (e.g., `{ "prompt": "your prompt" }`).

    **Example `app.js` modification (conceptual):**
    ```javascript
    // Inside js/app.js
    // const BACKEND_URL = 'https://your-unique-app-name.herokuapp.com'; // Or your deployed backend URL
    //
    // async function getAIResponseFromBackend(prompt) {
    //     const response = await fetch(`${BACKEND_URL}/api/ai-proxy`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ prompt: prompt })
    //     });
    //     if (!response.ok) throw new Error('Backend AI request failed');
    //     const data = await response.json();
    //     return data.response; // Assuming backend sends { response: "..." }
    // }

    // // Then in your event listener:
    // const aiData = await getAIResponseFromBackend(userPrompt);
    // aiOutputDiv.textContent = aiData;
    ```

## Important Considerations for Real Implementation

*   **API Key Management**: Store external API keys securely using Heroku's config vars or other secret management services. Do NOT hardcode them in `server.js`.
*   **Error Handling**: Implement robust error handling for API requests and server operations.
*   **Security**:
    *   Configure CORS more restrictively for production (e.g., allow only your PWA's domain).
    *   Implement input validation and sanitization.
    *   Consider authentication/authorization if the backend provides access to sensitive operations or data.
*   **Scalability**: For production, you might need to scale your Heroku dynos.
*   **Logging**: Implement more comprehensive logging for monitoring and debugging (Heroku provides add-ons for this).

This conceptual backend provides a starting point for building out the server-side logic required for more advanced AI and Blockchain integrations in the PWA.
