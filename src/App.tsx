import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useProvideAuth, AuthContext } from './hooks/useAuth';
import Home from './pages/Home';
import LinkPage from './pages/LinkPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Features from './pages/Features';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';

function App() {
  const auth = useProvideAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/l/:slug" element={<LinkPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/features" element={<Features />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;