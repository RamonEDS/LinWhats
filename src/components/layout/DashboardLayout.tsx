import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Link as LinkIcon, 
  BarChart, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  LogOut,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      icon: <LayoutGrid size={20} />,
      label: 'Visão Geral',
      href: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      icon: <LinkIcon size={20} />,
      label: 'Meus Links',
      href: '/dashboard/links',
      active: location.pathname === '/dashboard/links'
    },
    {
      icon: <BarChart size={20} />,
      label: 'Estatísticas',
      href: '/dashboard/stats',
      active: location.pathname === '/dashboard/stats'
    },
    {
      icon: <Settings size={20} />,
      label: 'Configurações',
      href: '/settings',
      active: location.pathname === '/settings'
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link to="/" className="flex items-center space-x-2">
              <LinkIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold">LinkWhats</span>
            </Link>
          </div>

          <div className="px-3 mb-6">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Plus size={18} />}
              onClick={() => navigate('/dashboard/links')}
            >
              Criar Novo Link
            </Button>
          </div>

          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mr-3 ${item.active ? 'text-primary-500' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  {item.label}
                  {item.active && (
                    <ChevronRight 
                      size={16} 
                      className="ml-auto text-primary-500" 
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'Avatar'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <LogOut size={12} className="mr-1" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold">LinkWhats</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t"
            >
              <div className="px-4 py-3">
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<Plus size={18} />}
                  onClick={() => {
                    navigate('/dashboard/links');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Criar Novo Link
                </Button>
              </div>

              <nav className="px-4 py-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={`mr-3 ${item.active ? 'text-primary-500' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    {item.label}
                    {item.active && (
                      <ChevronRight 
                        size={16} 
                        className="ml-auto text-primary-500" 
                      />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="px-4 py-3 border-t">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'Avatar'}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-1"
                    >
                      <LogOut size={12} className="mr-1" />
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}