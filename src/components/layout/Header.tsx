import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  
  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <RouterLink to="/" className="flex items-center space-x-2">
          <MessageSquare className="h-7 w-7 text-whatsapp-500" />
          <span className="font-bold text-xl text-gray-900">LinkWhats</span>
        </RouterLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            FAQ
          </button>
        </nav>
        
        {/* Auth buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <RouterLink to="/dashboard">
                <Button variant="primary\" leftIcon={<User size={18} />}>
                  Dashboard
                </Button>
              </RouterLink>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <RouterLink to="/login">
                <Button variant="outline">Login</Button>
              </RouterLink>
              <RouterLink to="/register">
                <Button variant="primary">Sign Up</Button>
              </RouterLink>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection('pricing')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-left"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-left"
            >
              FAQ
            </button>
            
            <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
              {user ? (
                <>
                  <RouterLink to="/dashboard\" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" fullWidth leftIcon={<User size={18} />}>
                      Dashboard
                    </Button>
                  </RouterLink>
                  <Button variant="outline" fullWidth onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <RouterLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Login
                    </Button>
                  </RouterLink>
                  <RouterLink to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </RouterLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}