# Testing Strategy for PWA AI Blockchain Demo

This document outlines the conceptual testing strategy for the PWA AI Blockchain Demo application. Given the nature of the project (vanilla JS, conceptual integrations), full end-to-end automated testing with specific frameworks might be an overkill for the current stage, but we can define areas and types of tests that would be valuable.

## 1. PWA Compliance & Features

*   **Lighthouse Audits**:
    *   **Objective**: Ensure the application meets PWA criteria.
    *   **Method**: Regularly run Lighthouse audits in Chrome DevTools.
    *   **Key Checks**:
        *   Manifest validity and properties (name, short_name, start_url, icons, display, theme_color).
        *   Service worker registration and activation.
        *   Offline availability (app loads when offline after initial visit).
        *   Performance, Accessibility, Best Practices, SEO (as provided by Lighthouse).
*   **Manual PWA Testing**:
    *   **Objective**: Verify "Add to Home Screen" functionality and offline behavior.
    *   **Method**:
        *   On supported devices/browsers, test the "Add to Home Screen" prompt and installation.
        *   Verify the app launches correctly from the home screen icon.
        *   Disconnect from the network and try to load/use the app. Check if cached assets are served.

## 2. UI Interaction & Basic Functionality

*   **Manual Click-Through Testing**:
    *   **Objective**: Ensure all interactive elements work as expected and UI updates correctly.
    *   **Method**:
        *   Click "Fetch AI Data" button:
            *   Verify "Fetching AI response..." message appears.
            *   Verify a mock AI response is displayed.
            *   Verify console logs for the mock AI function.
        *   Click "Get Blockchain Data" button:
            *   Verify "Fetching blockchain data..." message appears.
            *   Verify a mock blockchain response is displayed.
            *   Verify console logs for the mock blockchain function.
        *   Check basic layout and responsiveness on different screen sizes (using browser dev tools).
*   **JavaScript Unit Tests (Conceptual - e.g., using a simple assertion library or Jest/Mocha if scaling up)**:
    *   **Objective**: Test individual functions in `app.js`, especially the mock data generators.
    *   **Method**:
        *   `getMockAIResponse(prompt)`:
            *   Test with various prompts ("hello", "recommend", other) and assert expected string outputs.
            *   Test for the simulated delay (harder to unit test precisely without async testing utilities, but can check for Promise return).
        *   `getMockBlockchainData(query)`:
            *   Test with various queries ("latestBlock", "record:data", "tokenBalance", unknown) and assert expected string formats or error messages.
            *   Verify random data generation leads to correctly formatted strings.
    *   **Note**: Setting up a test runner and environment for vanilla JS in this sandbox is complex. Conceptually, one would write `.test.js` files.

## 3. Service Worker Logic

*   **Manual Cache Inspection**:
    *   **Objective**: Verify that the correct files are cached by the service worker.
    *   **Method**: Use browser developer tools (Application > Cache Storage) to inspect the contents of the cache after the service worker installs.
    *   **Key Checks**:
        *   `index.html`, `css/style.css`, `js/app.js`, `manifest.json`, and image files are present in the cache.
*   **Offline Simulation**:
    *   **Objective**: Ensure the service worker serves cached files when offline.
    *   **Method**: In browser developer tools (Application > Service Workers or Network tab), check the "Offline" box. Reload the page and navigate.
    *   **Key Checks**: The application should still load its basic shell.
*   **Cache Busting on Update (Conceptual)**:
    *   **Objective**: If the `CACHE_NAME` changes in `sw.js`, old caches should be cleared.
    *   **Method**:
        1.  Load the app with `CACHE_NAME = 'v1'`.
        2.  Modify `sw.js` to `CACHE_NAME = 'v2'`.
        3.  Reload/restart the service worker.
        4.  Inspect Cache Storage to ensure `v1` is deleted and `v2` is active.

## 4. Integration Points (Conceptual - for actual services)

*   **AI Service Integration**:
    *   **Objective**: Verify that the application can successfully communicate with the (proxied) AI service and display real responses.
    *   **Method**: End-to-end tests sending actual prompts and validating the structure or content of the AI's response. This would involve setting up a test version of the proxy and potentially mock responses from the actual AI service for predictability.
*   **Blockchain Service Integration**:
    *   **Objective**: Verify that the application can successfully read data from the blockchain or interact with a wallet for transactions.
    *   **Method**:
        *   **Read operations**: Query a testnet or mainnet (for public data) and validate the format/content of the returned data.
        *   **Write operations (if implemented)**: This is complex. Would involve using test wallets on a testnet, initiating transactions, and verifying their success on a block explorer.

## Tools (Conceptual for this project, common in web dev)

*   Browser Developer Tools (Chrome DevTools, Firefox Developer Tools) - Essential for PWA, SW, UI, and network inspection.
*   Lighthouse - For PWA audits.
*   JavaScript testing frameworks (e.g., Jest, Mocha, Jasmine) - For unit and integration tests of JS logic.
*   End-to-end testing tools (e.g., Cypress, Playwright, Puppeteer) - For automating UI interactions in a real browser.

For the current state of this project, manual testing focusing on PWA features (Lighthouse, offline check) and UI click-throughs for the mock services is the most practical approach. The outline for unit tests and integration tests serves as a guideline for future expansion.
