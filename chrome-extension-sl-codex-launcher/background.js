// Placeholder URL for the Solo Leveling Codex PWA
const PWA_URL = "https://www.sl-codex.com"; // Replace with the actual deployed URL

// Listen for a click on the browser action (toolbar icon)
chrome.action.onClicked.addListener(async (tab) => {
  // Try to find if a tab with the PWA_URL is already open
  try {
    const tabs = await chrome.tabs.query({ url: `${PWA_URL}*` });

    if (tabs && tabs.length > 0) {
      // If found, focus the first existing tab and its window
      const existingTab = tabs[0];
      if (existingTab.id) {
        await chrome.tabs.update(existingTab.id, { active: true });
        if (existingTab.windowId) {
          await chrome.windows.update(existingTab.windowId, { focused: true });
        }
        console.log(`Focused existing tab for: ${PWA_URL}`);
      } else {
        // Fallback if tab ID is somehow missing (shouldn't happen)
        chrome.tabs.create({ url: PWA_URL });
        console.log(`Opened new tab for: ${PWA_URL} (fallback due to missing tab ID)`);
      }
    } else {
      // If not found, create a new tab
      chrome.tabs.create({ url: PWA_URL });
      console.log(`Opened new tab for: ${PWA_URL}`);
    }
  } catch (error) {
    console.error("Error handling browser action click:", error);
    // Fallback in case of any error during tab querying/updating
    chrome.tabs.create({ url: PWA_URL });
    console.log(`Opened new tab for: ${PWA_URL} (error fallback)`);
  }
});

// Optional: Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("Solo Leveling Codex Launcher extension installed.");
    // Here you could potentially open the PWA page on first install,
    // but it's often better to let the user click the icon first.
    // chrome.tabs.create({ url: PWA_URL });
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    // const newVersion = chrome.runtime.getManifest().version;
    // console.log(`Solo Leveling Codex Launcher extension updated to version ${newVersion}.`);
  }
});
