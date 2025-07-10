// Background service worker for the Chrome extension

// Listen for the extension's installation event
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        console.log("PWA AI Blockchain Viewer extension installed.");
        // You could open the PWA page automatically upon installation,
        // or open a welcome page bundled with the extension.
        // For now, we'll just log a message.
        // Example: If you have a welcome.html in your extension:
        // chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        console.log("PWA AI Blockchain Viewer extension updated.");
    }
});

// Example: If you wanted the extension icon to directly open the PWA
// (instead of a popup), you would use chrome.action.onClicked:
/*
chrome.action.onClicked.addListener((tab) => {
    const pwaUrl = "YOUR_PWA_HOSTED_URL_HERE"; // Replace with actual URL
    if (pwaUrl !== "YOUR_PWA_HOSTED_URL_HERE") {
        chrome.tabs.create({ url: pwaUrl });
    } else {
        // Fallback or error handling if URL is not set
        // Perhaps open the popup or an options page
        console.log("PWA URL not configured for direct open.");
    }
});
*/
// Note: If using chrome.action.onClicked, you typically remove the "default_popup"
// from manifest.json's "action" field.
// For this example, we are using a popup, so the above onClicked is commented out.

console.log("Background service worker started.");
