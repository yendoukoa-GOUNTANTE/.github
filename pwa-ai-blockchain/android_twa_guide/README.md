# Android Deployment using Trusted Web Activity (TWA)

Trusted Web Activity (TWA) is a way to package your Progressive Web App (PWA) as an Android application. It allows your PWA, served from your website over HTTPS, to be rendered fullscreen by the user's installed Chrome browser, providing a native-like experience. The PWA still lives on your web server.

## Prerequisites

1.  **PWA Compliance**: Your web app must be a valid PWA, meeting criteria such as:
    *   Served over HTTPS.
    *   Valid `manifest.json` with properties like `short_name`, `start_url`, icons.
    *   A service worker providing basic offline capabilities.
2.  **Digital Asset Links**: You need to establish a link between your Android app and your website using a Digital Asset Links file (`assetlinks.json`) hosted on your website. This proves ownership and allows the PWA to run in fullscreen without browser UI.
3.  **Android Studio**: For building the Android app.
4.  **Bubblewrap CLI (Recommended)**: Google's command-line tool that simplifies creating TWA projects.
    *   Installation: `npm install -g @bubblewrap/cli` (requires Node.js)

## Steps to Create a TWA using Bubblewrap CLI

Bubblewrap automates most of the TWA setup.

1.  **Initialize Bubblewrap Project**:
    Navigate to a directory where you want to create your Android project and run:
    ```bash
    bubblewrap init --manifest https://YOUR_PWA_URL/manifest.json
    ```
    Replace `https://YOUR_PWA_URL/manifest.json` with the actual URL of your deployed PWA's manifest file. Bubblewrap will fetch information from your manifest to configure the Android project. It will ask you a series of questions (application ID, name, paths for signing keys, etc.).

2.  **Build the Android Project**:
    After initialization, Bubblewrap creates an Android project. To build the APK (or App Bundle):
    ```bash
    bubblewrap build
    ```
    This command will generate a signed Android app ready for testing or publishing to the Google Play Store. It will also provide you with the `assetlinks.json` content that you need to host on your website.

3.  **Host `assetlinks.json`**:
    Bubblewrap will output the content for your `assetlinks.json` file. This file must be hosted on your website at the following location:
    `https.YOUR_PWA_DOMAIN/.well-known/assetlinks.json`

    The content will look something like this (Bubblewrap provides the exact content):
    ```json
    [{
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "your.twa.application.id",
        "sha256_cert_fingerprints": ["YOUR_APP_SIGNING_KEY_SHA256_FINGERPRINT"]
      }
    }]
    ```
    *   `your.twa.application.id`: The package name you chose during `bubblewrap init`.
    *   `YOUR_APP_SIGNING_KEY_SHA256_FINGERPRINT`: The SHA256 fingerprint of the signing key used for your Android app. Bubblewrap helps generate this.

4.  **Test**:
    *   Ensure `assetlinks.json` is correctly hosted and accessible.
    *   Install the generated APK on an Android device with Chrome installed.
    *   When you open the app, it should display your PWA in fullscreen. Use Chrome DevTools remote debugging to inspect if needed.

## Manual TWA Setup (Conceptual Overview)

If not using Bubblewrap, the manual process is more involved:

1.  **Create an Android Project**: In Android Studio.
2.  **Add TWA Support Library**: Add the `androidx.browser:browser` dependency to your app's `build.gradle` file.
    ```gradle
    // In app/build.gradle
    dependencies {
        implementation 'androidx.browser:browser:1.4.0' // Use the latest version
        // ... other dependencies
    }
    ```
3.  **Configure `AndroidManifest.xml`**:
    *   Set up an `<activity>` that uses `TwaLauncherActivity` or a custom launcher activity.
    *   Define the `DEFAULT_URL` (your PWA's start URL) and other necessary meta-data.
    *   Reference your `assetlinks.json` validation (implicitly done by Chrome if hosted correctly).
4.  **Signing and `assetlinks.json`**: Generate a signing key, get its SHA256 fingerprint, and create/host the `assetlinks.json` file as described above.

## Key Considerations for TWA

*   **Chrome Dependency**: TWAs rely on the user having Google Chrome (or another supporting browser like Microsoft Edge on Android) installed and enabled on their device. You can configure fallbacks if Chrome is not available.
*   **Updates**: Your PWA updates are live as soon as you deploy changes to your web server. The Android app (wrapper) itself only needs updating if you change native configurations or icons.
*   **Splash Screen**: TWAs automatically use a splash screen generated from your PWA's manifest information (`name`, `background_color`, `icon`).
*   **Deep Linking**: Android App Links work with TWAs, allowing your app to handle links to your website.
*   **Push Notifications**: Web push notifications from your PWA will appear as native Android notifications.
*   **Limited Native Access**: TWAs are primarily for displaying web content. For deeper native API access beyond what web standards offer, you might need to add custom Java/Kotlin code or consider other frameworks.

## Further Reading

*   **Official TWA Guide**: [https://developer.chrome.com/docs/android/trusted-web-activity/](https://developer.chrome.com/docs/android/trusted-web-activity/)
*   **Bubblewrap CLI**: [https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli](https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli)
*   **Digital Asset Links**: [https://developer.android.com/training/app-links/verify-site-associations](https://developer.android.com/training/app-links/verify-site-associations)

This guide provides a starting point for deploying your PWA to Android using TWA. Always refer to the latest official documentation for the most up-to-date practices.
