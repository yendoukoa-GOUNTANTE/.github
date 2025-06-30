import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#333', color: 'white', padding: '20px', textAlign: 'center', marginTop: 'auto' }}>
      <p>&copy; {new Date().getFullYear()} GlamFilter AR. All Rights Reserved (Conceptually).</p>
      {/* Add other footer links if needed, e.g., Privacy Policy, Contact */}
    </footer>
  );
};

export default Footer;
