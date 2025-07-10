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
├── public/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── images/
│   │   ├── icon-192x192.png  # PWA icon
│   │   └── icon-512x512.png  # PWA icon
│   ├── js/
│   │   └── app.js            # Main application logic, AI/Blockchain mocks
│   ├── index.html            # Main HTML file
│   ├── manifest.json         # PWA manifest file
│   └── sw.js                 # Service worker script
└── README.md                 # This file
```

## How to Run

1.  Serve the `public` directory using a local web server. For example, using Python's built-in server:
    ```bash
    cd pwa-ai-blockchain/public
    python -m http.server
    ```
    Or using Node.js `http-server`:
    ```bash
    npm install -g http-server
    cd pwa-ai-blockchain/public
    http-server -c-1 # -c-1 disables caching for easier development updates
    ```
2.  Open your browser and navigate to the local server address (e.g., `http://localhost:8000` or `http://localhost:8080`).
3.  You can test PWA features using browser developer tools (e.g., Lighthouse, Application tab in Chrome DevTools).

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
