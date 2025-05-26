import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useProvideAuth, AuthContext } from './hooks/useAuth';
import Home from './pages/Home';
import LinkPage from './pages/LinkPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLinks from './pages/DashboardLinks';
import DashboardStats from './pages/DashboardStats';
import Settings from './pages/Settings';

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
          <Route path="/dashboard/links" element={<DashboardLinks />} />
          <Route path="/dashboard/stats" element={<DashboardStats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;