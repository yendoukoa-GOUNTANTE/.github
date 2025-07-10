// Background script for the Firefox extension
// Using browser.* namespace

// Listen for the extension's installation event
if (typeof browser !== "undefined" && browser.runtime && browser.runtime.onInstalled) {
    browser.runtime.onInstalled.addListener(details => {
        if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
            console.log("PWA AI Blockchain Viewer (Firefox) extension installed.");
            // You could open the PWA page automatically upon installation,
            // or open a welcome page bundled with the extension.
            // Example: If you have a welcome.html in your extension:
            // browser.tabs.create({ url: browser.runtime.getURL("welcome.html") });
        } else if (details.reason === browser.runtime.OnInstalledReason.UPDATE) {
            console.log("PWA AI Blockchain Viewer (Firefox) extension updated.");
        }
    });
} else if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onInstalled) {
    // Fallback for environments that might alias chrome to browser but not browser to chrome fully
    console.warn("Using chrome.runtime.onInstalled as browser.runtime.onInstalled is unavailable.");
    chrome.runtime.onInstalled.addListener(details => {
        if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
            console.log("PWA AI Blockchain Viewer (Firefox - using Chrome API) extension installed.");
        } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
            console.log("PWA AI Blockchain Viewer (Firefox - using Chrome API) extension updated.");
        }
    });
} else {
    console.warn("browser.runtime.onInstalled and chrome.runtime.onInstalled are not available.");
}


// If you wanted the extension icon to directly open the PWA (instead of a popup):
// 1. Remove/comment out "default_popup" in manifest.json's "action" field.
// 2. Uncomment the following:
/*
if (typeof browser !== "undefined" && browser.action && browser.action.onClicked) {
    browser.action.onClicked.addListener((tab) => {
        const pwaUrl = "YOUR_PWA_HOSTED_URL_HERE"; // Replace with actual URL
        if (pwaUrl && pwaUrl !== "YOUR_PWA_HOSTED_URL_HERE") {
            browser.tabs.create({ url: pwaUrl });
        } else {
            console.error("PWA URL not configured for direct open in background.js.");
            // Fallback: maybe open a bundled options page or show an error.
            // browser.runtime.openOptionsPage(); // If you have an options page
        }
    });
} else {
    console.warn("browser.action.onClicked is not available.");
}
*/

console.log("Firefox extension background script started.");
