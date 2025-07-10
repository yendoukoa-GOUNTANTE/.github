# PWA AI Blockchain Integration Demo

This project is a Progressive Web App (PWA) designed to demonstrate a conceptual integration of AI and Blockchain features. It's built with vanilla HTML, CSS, and JavaScript, and showcases a basic PWA structure including a service worker for offline caching.

## Features

*   **Progressive Web App (PWA)**:
    *   Includes a `manifest.json` for "add to homescreen" functionality and app metadata.
    *   Uses a `sw.js` (service worker) to cache core application assets for offline availability.
*   **AI Feature (Placeholder)**:
    *   A UI section in `index.html` with a button to "Fetch AI Data".
    *   `js/app.js` contains a `getMockAIResponse` function that simulates an AI responding to prompts (e.g., "hello", "recommend").
*   **Blockchain Feature (Placeholder)**:
    *   A UI section in `index.html` with a button to "Get Blockchain Data".
    *   `js/app.js` contains a `getMockBlockchainData` function that simulates blockchain interactions (e.g., fetching latest block info, recording data, checking token balance).
*   **Basic UI**: A simple, clean interface to interact with the placeholder features.

## Project Structure

```
pwa-ai-blockchain/
├── android_twa_guide/        # Guide for Android TWA deployment
│   ├── README.md
│   ├── conceptual_assetlinks.json
│   └── conceptual_build.gradle_snippet.txt
├── backend/                  # Conceptual Node.js backend proxy
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── README.md
├── chrome_extension/         # Chrome Extension wrapper
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── background.js
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── docs/                     # Additional documentation
│   ├── alternative_hybrid_frameworks.md
│   └── pwa_mobile_enhancements.md
├── ios_webview_guide/        # Guide for iOS WKWebView deployment
│   ├── README.md
│   └── ConceptualViewController.swift
├── meta_quest_guide/         # Guide for Meta Quest deployment
│   └── README.md
├── public/                   # PWA static assets
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── js/
│   │   └── app.js
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
├── netlify.toml              # Netlify deployment configuration
├── README.md                 # This main project README
└── TESTING_STRATEGY.md       # Document outlining testing approaches
```

## Components

### 1. PWA (Progressive Web App)
   - Located in the `public/` directory.
   - Vanilla HTML, CSS, and JavaScript.
   - Service worker (`sw.js`) for offline caching.
   - Manifest file (`manifest.json`) for PWA properties.
   - Mock AI and Blockchain feature interactions in `js/app.js`.

### 2. Chrome Extension Wrapper
   - Located in the `chrome_extension/` directory.
   - A simple Manifest V3 extension.
   - Provides a popup to open the (hosted) PWA URL.
   - **Note**: The PWA must be hosted at a public URL for the extension to open it as configured in `popup.js`.

### 3. Conceptual Backend Proxy
   - Located in the `backend/` directory.
   - A Node.js Express server designed to act as a proxy for real AI/Blockchain API calls (currently mocks responses).
   - Includes a `Dockerfile` for containerization and a `Procfile` for Heroku deployment.
   - See `backend/README.md` for more details on running this server locally (Node.js or Docker) and for detailed Heroku deployment instructions.

### 4. Deployment & Testing
   - `netlify.toml`: Configuration for deploying the static PWA to Netlify.
   - `TESTING_STRATEGY.md`: Outlines approaches for testing different parts of the application.


## How to Run

### PWA (Locally)
1.  Serve the `pwa-ai-blockchain/public` directory using a local web server. For example, using Python:
    ```bash
    cd pwa-ai-blockchain/public
    python -m http.server
    ```
    Or using Node.js `http-server`:
    ```bash
    npm install -g http-server
    cd pwa-ai-blockchain/public
    http-server -c-1
2.  Open your browser and navigate to the local server address (e.g., `http://localhost:8000` or `http://localhost:8080`).
3.  You can test PWA features using browser developer tools (e.g., Lighthouse, Application tab in Chrome DevTools).

### Chrome Extension
1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" (usually a toggle in the top right).
3.  Click "Load unpacked".
4.  Select the `pwa-ai-blockchain/chrome_extension` directory.
5.  The extension icon should appear in your Chrome toolbar. Clicking it will show a popup.
6.  **Important**: You need to update `pwa-ai-blockchain/chrome_extension/popup.js` with the actual hosted URL of your PWA for the "Open App" button to work correctly.

### Backend Server
   - See instructions in `pwa-ai-blockchain/backend/README.md`.

### Backend Server
   - See instructions in `pwa-ai-blockchain/backend/README.md`.

### Mobile App Deployment (Conceptual Guides)
   - **Android (TWA)**: See `pwa-ai-blockchain/android_twa_guide/README.md` for deploying as a Trusted Web Activity.
   - **iOS (WKWebView Wrapper)**: See `pwa-ai-blockchain/ios_webview_guide/README.md` for conceptually wrapping the PWA in a native iOS app.

### Mobile App Deployment (Conceptual Guides)
   - **Android (TWA)**: See `pwa-ai-blockchain/android_twa_guide/README.md` for deploying as a Trusted Web Activity.
   - **iOS (WKWebView Wrapper)**: See `pwa-ai-blockchain/ios_webview_guide/README.md` for conceptually wrapping the PWA in a native iOS app.
   - **Alternative Hybrid Frameworks**: For more advanced native integration, see `pwa-ai-blockchain/docs/alternative_hybrid_frameworks.md`.
   - **PWA Mobile Enhancements**: Key considerations for a good mobile PWA experience are discussed in `pwa-ai-blockchain/docs/pwa_mobile_enhancements.md`.
   - **Meta Quest (VR Headset)**: See `pwa-ai-blockchain/meta_quest_guide/README.md` for running as a PWA or packaged app (via TWA method), and notes on WebXR. This guide has been updated with a more detailed step-by-step checklist for manual TWA/Bubblewrap deployment.

### Deploying the PWA

The PWA is designed to be deployed as a static site. Here are a few common hosting options:

#### 1. Deploying to Netlify

Netlify is excellent for hosting static sites and PWAs.
1.  **Prerequisites**:
    *   A Netlify account.
    *   Your project pushed to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Setup on Netlify**:
    *   Log in to your Netlify account.
    *   Click "New site from Git".
    *   Choose your Git provider and select the repository for this project.
    *   Configure the build settings:
        *   **Base directory**: If your `netlify.toml` and `public` folder are in the `pwa-ai-blockchain` subfolder of your repo, set this to `pwa-ai-blockchain`. If `pwa-ai-blockchain` is the root of your repo, leave this blank.
        *   **Build command**: Leave this blank (no build step for this simple static site).
        *   **Publish directory**: Set this to `public` (if base directory is `pwa-ai-blockchain`) or `pwa-ai-blockchain/public` (if base directory is repo root). This should align with the `publish` setting in `netlify.toml`.
    *   Netlify will use the `netlify.toml` file (located at the root of your specified base directory, e.g., `pwa-ai-blockchain/netlify.toml`) for configuration.
    *   Deploy the site.
3.  **Access your deployed PWA** via the URL provided by Netlify.

The `netlify.toml` file included in this project provides basic configuration for serving the PWA.

#### 2. Deploying to Firebase Hosting

Firebase Hosting is another robust option for static sites and PWAs.
1.  **Prerequisites**:
    *   A Google account and a Firebase project set up at [console.firebase.google.com](https://console.firebase.google.com/).
    *   Firebase CLI installed: `npm install -g firebase-tools`.
    *   Logged into Firebase CLI: `firebase login`.
2.  **Initialization**:
    *   Navigate to the `pwa-ai-blockchain` directory in your terminal (or your repo root if `pwa-ai-blockchain` is a subfolder).
    *   Run `firebase init hosting`.
    *   When prompted:
        *   Select your Firebase project.
        *   Specify your public directory: `public` (if you ran `init` from `pwa-ai-blockchain/`) or `pwa-ai-blockchain/public` (if you ran `init` from the repo root containing the `pwa-ai-blockchain` folder).
        *   Configure as a single-page app: **Yes** (this sets up rewrites to `index.html`).
        *   Set up automatic builds and deploys with GitHub: Optional, can be done. If you choose no, you'll deploy manually.
        *   Overwrite `public/index.html`? **No** (if it asks, as you already have one).
    *   This will create `firebase.json` (if not already present or if you choose to overwrite) and `.firebaserc`. A template `firebase.json` is already included in this project (`pwa-ai-blockchain/firebase.json`) with recommended headers and settings. You can let `firebase init` create it and then compare or merge, or copy the provided one into the correct location (usually repo root or the directory from which you deploy). The key is that the `hosting.public` path in `firebase.json` must correctly point to your `public` PWA assets.
3.  **Deployment**:
    *   Run `firebase deploy --only hosting`.
4.  **Access your deployed PWA** via the Hosting URL provided in your Firebase console or CLI output.

The `firebase.json` file provided in this project includes configurations for the public directory, SPA rewrites, and custom headers for caching and security.

#### 3. Deploying to GitHub Pages

GitHub Pages can host static sites directly from your repository.
1.  **Prerequisites**:
    *   Your project pushed to a GitHub repository.
2.  **Setup Options**:
    *   **Using GitHub Actions (Recommended)**:
        *   A workflow file `pwa-ai-blockchain/.github/workflows/deploy-gh-pages.yml` is provided in this project.
        *   Commit this file to your repository (ensure paths within the workflow file are correct for your repository structure - see comments in the YAML file).
        *   In your repository settings (Settings > Pages), under "Build and deployment", set the "Source" to "GitHub Actions".
        *   The workflow will automatically build (if needed, though not for this PWA) and deploy your site.
    *   **Manual/Branch Deployment (Simpler for no-build sites but less automated)**:
        *   You can configure GitHub Pages to serve from a specific branch (e.g., `gh-pages`) or a `/docs` folder on your `main` branch. You would manually push the contents of your `public/` directory to this location.
3.  **Important Considerations for GitHub Pages (Subpath Deployment)**:
    *   If your repository is NOT `your-username.github.io` (e.g., it's `your-username/my-pwa-project`), your site will be served from a subpath (e.g., `https://your-username.github.io/my-pwa-project/`).
    *   This **requires changes** to your PWA:
        *   **`manifest.json`**: `start_url` and `scope` must include the subpath (e.g., `/my-pwa-project/`).
        *   **Asset Paths**: All absolute paths in `index.html`, `sw.js` (especially `urlsToCache`), and CSS for resources like images must be prefixed with the subpath. Using relative paths consistently within your PWA source is the best way to handle this. The current PWA uses relative paths for CSS/JS from `index.html` but absolute paths in `sw.js` cache list, which **will need adjustment** for subpath deployment.
        *   **Service Worker Registration**: In `js/app.js`, register the service worker with the correct subpath: `navigator.serviceWorker.register('/my-pwa-project/sw.js', { scope: '/my-pwa-project/' })`.
    *   The GitHub Actions workflow provided has comments guiding on path adjustments.
4.  **Access your deployed PWA** via the URL provided in your repository's Pages settings.

---

## Conceptual Integration of Actual Services

1.  **Prerequisites**:
    *   A Netlify account.
    *   Your project pushed to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Setup on Netlify**:
    *   Log in to your Netlify account.
    *   Click "New site from Git".
    *   Choose your Git provider and select the repository for this project.
    *   Configure the build settings:
        *   **Base directory**: If your `netlify.toml` and `public` folder are in the `pwa-ai-blockchain` subfolder of your repo, you might set this to `pwa-ai-blockchain`. If `pwa-ai-blockchain` is the root of your repo, leave this blank or as `/`.
        *   **Build command**: Leave this blank (as there's no build step for this simple static site).
        *   **Publish directory**: Set this to `public` (if your base directory is `pwa-ai-blockchain`) or `pwa-ai-blockchain/public` (if your base directory is the repo root). This should match the `publish` setting in `netlify.toml`.
    *   Netlify will use the `netlify.toml` file in the root of your specified base directory for configuration (e.g., for SPA redirects).
    *   Deploy the site.
3.  **Access your deployed PWA** via the URL provided by Netlify.

The `netlify.toml` file included in this project provides basic configuration for serving the PWA, including an SPA redirect rule which is good practice, though not strictly necessary for this single-page PWA.

## Conceptual Integration of Actual Services

The current AI and Blockchain functionalities are mock implementations. To integrate real services:

### AI Integration:

1.  **Choose an AI Service**: Select an AI service provider (e.g., OpenAI API, Google AI Platform, Hugging Face).
2.  **API Key Management**: Securely manage API keys. For client-side PWAs, this typically means having a backend proxy that makes requests to the AI service to avoid exposing keys.
3.  **Modify `getMockAIResponse`**:
    *   Replace the mock logic with actual `fetch` calls to your backend proxy.
    *   The proxy would then call the chosen AI service API.
    *   Example (conceptual `app.js` change):
        ```javascript
        // async function getRealAIResponse(prompt) {
        //     const response = await fetch('/api/ai-proxy', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ prompt: prompt })
        //     });
        //     if (!response.ok) throw new Error('AI API request failed');
        //     return await response.json(); // Or response.text() depending on API
        // }
        ```
4.  **Backend Proxy**: Implement a simple server (e.g., Node.js/Express, Python/Flask) that receives requests from the PWA, adds the API key, calls the AI service, and returns the response.

### Blockchain Integration:

1.  **Choose a Blockchain Platform & Interaction Method**:
    *   **Reading Data**: Many blockchains have public APIs (e.g., Etherscan for Ethereum, or specific node provider APIs like Infura, Alchemy).
    *   **Writing Data/Transactions**: This typically requires a wallet integration library (e.g., Web3.js, Ethers.js for EVM-compatible chains) and user interaction to sign transactions.
2.  **Client-Side Libraries (for reading or interacting with wallets)**:
    *   Include necessary libraries (e.g., `web3.min.js`).
    *   Connect to a blockchain node provider or use a wallet extension like MetaMask.
3.  **Modify `getMockBlockchainData`**:
    *   **Reading Data**:
        ```javascript
        // Example with Web3.js (conceptual)
        // const web3 = new Web3(Web3.givenProvider || "YOUR_NODE_URL");
        // async function getRealBlockchainData(query) {
        //     if (query === "latestBlock") {
        //         const block = await web3.eth.getBlock("latest");
        //         return `Latest Block: #${block.number}, Hash: ${block.hash}`;
        //     }
        //     // ... other queries
        // }
        ```
    *   **Writing Data**: This is more complex and involves user authentication/signing.
        ```javascript
        // Example: Sending a transaction (highly conceptual)
        // async function recordDataOnBlockchain(data) {
        //     const accounts = await web3.eth.requestAccounts(); // Requires user permission
        //     const txHash = await myContract.methods.record(data).send({ from: accounts[0] });
        //     return `Data recorded. Transaction hash: ${txHash}`;
        // }
        ```
4.  **Smart Contracts**: If your application logic requires custom on-chain rules, you would need to develop and deploy smart contracts to the chosen blockchain.

## PWA Considerations

*   **Offline Strategy**: The current service worker uses a cache-first strategy for app shell files. For dynamic data (AI/Blockchain responses), you might implement different strategies (e.g., network-first, or stale-while-revalidate) or provide specific offline feedback if data cannot be fetched.
*   **Security**: Be mindful of API key exposure and data privacy, especially with client-side applications. Backend proxies are recommended for services requiring secret keys. Blockchain transactions require careful handling of user keys and signing processes.
*   **User Experience**: Provide clear feedback to the user about network status, data fetching, and any AI/Blockchain interactions.

This project serves as a starting template. Real-world integration of AI and Blockchain would require significant additional development, security considerations, and choice of specific platforms/services.
