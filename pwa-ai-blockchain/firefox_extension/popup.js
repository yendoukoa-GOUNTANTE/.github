// Using browser.* namespace for Firefox compatibility
document.getElementById('openPwa').addEventListener('click', () => {
    // Replace this URL with the actual deployed URL of your PWA
    const pwaUrl = "YOUR_PWA_HOSTED_URL_HERE";
    // For local testing, you might use something like "http://localhost:8000"
    // (if your PWA is served on port 8000)
    // However, for a real extension, it should be a publicly accessible HTTPS URL.

    if (pwaUrl === "YOUR_PWA_HOSTED_URL_HERE") {
        // In a real extension, provide a more user-friendly way to set this,
        // perhaps via an options page or a default value.
        alert("Please update popup.js with the PWA's hosted URL.");
        return;
    }

    // Check if browser.tabs.create is available, otherwise fallback to chrome.tabs.create
    if (typeof browser !== "undefined" && browser.tabs && browser.tabs.create) {
        browser.tabs.create({ url: pwaUrl });
    } else if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
        console.warn("Using chrome.tabs.create as browser.tabs.create is unavailable.");
        chrome.tabs.create({ url: pwaUrl });
    } else {
        console.error("Tabs API not available to open PWA.");
        alert("Could not open PWA: Tabs API unavailable.");
    }
});
