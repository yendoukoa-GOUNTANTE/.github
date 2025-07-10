# Meta Quest Deployment Guide

This guide outlines strategies for deploying the PWA AI Blockchain application to Meta Quest devices. The primary methods are leveraging the PWA support in the Meta Quest Browser or packaging the PWA as an Android APK using Trusted Web Activity (TWA) principles.

## Method 1: Progressive Web App (PWA) in Meta Quest Browser

The Meta Quest Browser (based on Chromium) has excellent support for PWAs.

1.  **Host your PWA**: Ensure your PWA is hosted on a secure (HTTPS) server.
2.  **Meet PWA Criteria**:
    *   Valid `manifest.json` (properly configured `display: standalone`, icons, `start_url`, etc.).
    *   Service worker for offline capabilities.
    *   (The current project PWA is already set up with these).
3.  **Access in Meta Quest Browser**:
    *   Open the Meta Quest Browser in your headset.
    *   Navigate to your PWA's URL.
4.  **Installation**:
    *   The Meta Quest Browser should offer an "Install" or "Add to Home" option (often an icon in the URL bar or menu) if the PWA criteria are met.
    *   Once installed, the PWA will appear in your Quest's App Library and launch in a standalone window, much like a native app.

**Pros**:
*   Easiest method, no native app development needed.
*   Updates are seamless (just update your web app).
*   Leverages standard web technologies.

**Cons**:
*   The app runs as a 2D panel within the VR environment. It's not an immersive VR experience by default.
*   Distribution is via URL access, not directly through the Oculus Store (unless it's a very notable PWA that Meta decides to feature, or you package it as an APK - see below).

## Method 2: Packaging as an Android APK (via TWA approach)

Since Meta Quest devices run Android, you can package your PWA as an `.apk` file using the Trusted Web Activity (TWA) approach. This APK can then be sideloaded onto the device or potentially submitted to the Meta App Lab or Oculus Store (subject to Meta's policies).

This method makes your PWA look and feel more like a native application.

1.  **Prerequisites**:
    *   Your PWA must be hosted and meet all TWA requirements (HTTPS, valid manifest, service worker, Digital Asset Links verification).
    *   Node.js and npm installed.
    *   Bubblewrap CLI: `npm install -g @bubblewrap/cli`
    *   Android SDK Platform Tools (for `adb` if sideloading).
    *   A signing key for your Android app.

2.  **Using Bubblewrap CLI**:
    The process is very similar to creating a TWA for standard Android devices.
    *   **Initialize**:
        ```bash
        bubblewrap init --manifest https://YOUR_PWA_URL/manifest.json
        ```
        Follow the prompts. Pay attention to:
        *   **Application ID (Package Name)**: e.g., `com.yourdomain.pwaaibblockchainquest`
        *   **Launcher Name**: How it will appear in the Quest library.
        *   **Signing Key**: Provide paths to your keystore and alias, or let Bubblewrap help you create one.
    *   **Build**:
        ```bash
        bubblewrap build
        ```
        This will generate a signed APK (e.g., `app-release-signed.apk`) and the `assetlinks.json` content.
    *   **Host `assetlinks.json`**:
        Place the generated `assetlinks.json` file at `https://YOUR_PWA_DOMAIN/.well-known/assetlinks.json`. This is crucial for the TWA to run in fullscreen without the browser address bar. Refer to `pwa-ai-blockchain/android_twa_guide/conceptual_assetlinks.json` for structure.

3.  **Sideloading the APK to Meta Quest**:
    *   Enable Developer Mode on your Meta Quest device (via the Meta Quest mobile app).
    *   Connect your Quest to your computer via USB.
    *   Authorize the connection in the headset.
    *   Use `adb` (Android Debug Bridge) to install the APK:
        ```bash
        adb install path/to/your/app-release-signed.apk
        ```
    *   The app should now appear in your Quest's App Library under "Unknown Sources".

4.  **Distribution (App Lab / Oculus Store)**:
    *   If you wish to distribute more broadly, you'll need to prepare an App Bundle (`.aab`) instead of an APK. Bubblewrap can also generate this (`bubblewrap build --skipPwaValidation --aab`).
    *   Submission to App Lab or the main Oculus Store involves meeting Meta's technical and content guidelines, which include aspects beyond the PWA itself (e.g., comfort, safety, performance if it were a VR app). For a 2D PWA packaged as an APK, its viability on the store depends heavily on its utility and uniqueness.

**Pros**:
*   App appears in the Quest App Library like a native app.
*   Can potentially be distributed via App Lab or Oculus Store.
*   Still leverages your web-hosted PWA for content.

**Cons**:
*   More setup involved than just accessing via browser.
*   Updates to the native wrapper (APK) require rebuilding and reinstalling/resubmitting, though PWA content updates are still web-driven.
*   Still primarily a 2D panel experience unless you evolve it to WebXR.

## UI/UX Considerations for 2D PWAs on Quest

*   **Readability**: Text and UI elements should be large enough to be comfortably read on the virtual screen. The CSS added for larger screens in `public/css/style.css` helps.
*   **Interaction**: Standard web interactions (clicks) are typically mapped to the Quest controller's trigger or primary button when pointing at UI elements. Ensure interactive areas are clear and easy to target.
*   **Performance**: Even as a 2D app, smooth performance is key. Optimize your PWA.
*   **No VR Immersion**: Remind users that this is a 2D application running in a VR environment.

## Evolving to a WebXR Application (Conceptual)

If you want to create a truly immersive VR experience with this application, you would need to transition it into a WebXR application.

1.  **Choose a WebXR Framework/Library**:
    *   **A-Frame**: HTML-based, easy to get started. (`<a-scene>`)
    *   **Babylon.js**: Powerful and comprehensive 3D engine with strong WebXR support.
    *   **Three.js**: Foundational 3D library, often used by other frameworks or directly for more control.
    *   **React Three Fiber / React XR**: For React-based WebXR development.

2.  **Design for VR**:
    *   Rethink UI/UX for 3D space (diegetic UI, gaze interaction, controller-based interaction).
    *   Consider VR comfort (avoiding motion sickness).

3.  **Implement WebXR API**:
    *   Use JavaScript to detect WebXR availability (`navigator.xr`).
    *   Request an 'immersive-vr' session.
    *   Set up a render loop, handle controller input (via WebXR Gamepad API), and render your 3D scene.

4.  **Placeholder WebXR Initialization**:
    A very basic conceptual check for WebXR might look like this (this code is illustrative and non-functional in the current 2D PWA):
    ```javascript
    // In a new file, e.g., public/js/webxr-init.js
    async function activateXR() {
        if (navigator.xr) {
            try {
                const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
                if (isSupported) {
                    // Session is supported. Create a button or UI element to enter VR.
                    const enterVRButton = document.createElement('button');
                    enterVRButton.textContent = 'Enter VR';
                    enterVRButton.onclick = async () => {
                        try {
                            const session = await navigator.xr.requestSession('immersive-vr', {
                                optionalFeatures: ['local-floor', 'bounded-floor']
                            });
                            // Handle session start (set up renderer, etc.)
                            console.log('WebXR session started:', session);
                            // This is where your 3D engine would take over.
                        } catch (e) {
                            console.error('Failed to start WebXR session:', e);
                        }
                    };
                    document.body.appendChild(enterVRButton); // Add button to the page
                } else {
                    console.log('Immersive VR session not supported.');
                }
            } catch (e) {
                console.error('Error checking WebXR support:', e);
            }
        } else {
            console.log('WebXR API not available.');
        }
    }
    // activateXR(); // Call this when you want to check for WebXR
    ```
    You would then need to integrate this with a 3D rendering engine.

Transitioning the current 2D PWA to a full WebXR application is a significant undertaking and a separate project in itself. For now, the focus is on making the existing 2D PWA accessible and usable on Meta Quest.
