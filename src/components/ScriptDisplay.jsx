import React from 'react';
import './ScriptDisplay.css';

function ScriptDisplay({ scriptContent }) {
  if (!scriptContent) {
    return null;
  }

  return (
    <div className="script-display-container">
      <h2>Generated Script & Storyboard</h2>
      <pre className="script-content-box">
        {scriptContent}
      </pre>
    </div>
  );
}

export default ScriptDisplay;
