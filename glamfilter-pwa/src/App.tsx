import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ShowcasePage from './pages/ShowcasePage';
import TipsListPage from './pages/TipsListPage';
import TipDetailPage from './pages/TipDetailPage';
import DownloadPage from './pages/DownloadPage';
// Assuming global styles like index.css are imported in main.tsx as per typical Vite setup

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ShowcasePage />} />
          <Route path="/tips" element={<TipsListPage />} />
          <Route path="/tips/:tipSlug" element={<TipDetailPage />} />
          <Route path="/download" element={<DownloadPage />} />
          {/* A simple "Not Found" route could be added here */}
          {/* <Route path="*" element={<div><h2>404 - Page Not Found</h2></div>} /> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
