import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Import global styles

// Declare FBInstant for TypeScript if types are not installed
// In a real project, you might install @types/fbinstant or similar
declare global {
  interface Window {
    FBInstant?: any; // Using 'any' for simplicity without full type definitions
  }
}

const initializeFacebookInstantGame = async () => {
  if (window.FBInstant) {
    try {
      console.log('FBInstant SDK found, initializing...');
      await window.FBInstant.initializeAsync();
      console.log('FBInstant initialized.');

      // Report loading progress (e.g., 100% when main app component is ready to mount)
      // This is a simplified progress report. A real app might have more stages.
      window.FBInstant.setLoadingProgress(100);
      console.log('Loading progress set to 100.');

      await window.FBInstant.startGameAsync();
      console.log('FBInstant game started.');

      // You can now use other FBInstant APIs, e.g., get player info
      // const playerName = window.FBInstant.player.getName();
      // console.log('Player name:', playerName);

    } catch (error) {
      console.error('FBInstant SDK initialization failed:', error);
    }
  } else {
    console.log('FBInstant SDK not found. Running in regular web mode.');
  }
};

// Initialize FB SDK then render app
initializeFacebookInstantGame().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
