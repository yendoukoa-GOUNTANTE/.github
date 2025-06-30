import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CharacterListPage from './pages/CharacterListPage';
// import './App.css'; // We'll create this later in styling step

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CharacterListPage />} />
          {/* Add other routes here later, e.g., for individual character detail pages */}
          {/* <Route path="/character/:id" element={<CharacterDetailPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
