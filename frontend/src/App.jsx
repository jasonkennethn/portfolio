import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AnimatedBackground from './components/ui/AnimatedBackground';

function AppContent() {
  const location = useLocation();
  const { loading } = usePortfolio();
  const showNavbar = location.pathname === '/' && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      {showNavbar && <Navbar />}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kenneth-648102" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
