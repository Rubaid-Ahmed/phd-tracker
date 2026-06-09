import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UniversityDetail from './pages/UniversityDetail';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
        </Routes>
      </HashRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
        }}
      />
    </AppProvider>
  );
}
