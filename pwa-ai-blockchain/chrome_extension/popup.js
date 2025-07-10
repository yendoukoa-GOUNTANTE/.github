document.getElementById('openPwa').addEventListener('click', () => {
    // Replace this URL with the actual deployed URL of your PWA
    const pwaUrl = "YOUR_PWA_HOSTED_URL_HERE";
    // For local testing, you might use something like "http://localhost:8000"
    // (if your PWA is served on port 8000)
    // However, for a real extension, it should be a publicly accessible HTTPS URL.

    if (pwaUrl === "YOUR_PWA_HOSTED_URL_HERE") {
        alert("Please update popup.js with the PWA's hosted URL.");
        return;
    }
    chrome.tabs.create({ url: pwaUrl });
});
