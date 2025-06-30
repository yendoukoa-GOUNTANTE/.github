import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flexGrow: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
