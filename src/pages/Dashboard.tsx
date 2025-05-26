import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Settings, 
  BarChart, 
  Check, 
  X,
  Home,
  Users,
  Link as LinkIcon,
  Bell,
  ChevronDown,
  Menu,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [showPlans, setShowPlans] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleCreateFirstLink = () => {
    navigate('/#create-form');
  };

  const plans = [
    {
      name: 'Grátis',
      price: '0',
      description: 'Para usuários iniciantes',
      features: [
        'Um link personalizado',
        'Página de redirecionamento básica',
        'QR Code básico',
        'Estatísticas básicas'
      ]
    },
    {
      name: 'Pro',
      price: '29,90',
      description: 'Para profissionais e empresas',
      features: [
        'Links ilimitados',
        'Personalização completa da página',
        'QR Code personalizado',
        'Estatísticas avançadas',
        'Múltiplos números de WhatsApp',
        'Remoção da marca LinkWhats',
        'Suporte prioritário'
      ]
    }
  ];

  const menuItems = [
    { icon: <Home size={20} />, label: 'Início', path: '/dashboard' },
    { icon: <LinkIcon size={20} />, label: 'Meus Links', path: '/dashboard/links' },
    { icon: <BarChart size={20} />, label: 'Estatísticas', path: '/dashboard/stats' },
    { icon: <Settings size={20} />, label: 'Configurações', path: '/settings' },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin">
          <MessageSquare className="h-8 w-8 text-whatsapp-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30"
          >
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-8">
                <MessageSquare className="h-8 w-8 text-whatsapp-500" />
                <span className="text-xl font-bold">LinkWhats</span>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-20" style={{ left: sidebarOpen ? '280px' : '0' }}>
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user.name || user.email}</span>
                  <ChevronDown size={16} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} />
                      <span>Configurações</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors w-full"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modal de Planos */}
        <AnimatePresence>
          {showPlans && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Planos Disponíveis</h2>
                  <button 
                    onClick={() => setShowPlans(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                      <Card key={plan.name} className={plan.name === 'Pro' ? 'border-primary-500 shadow-lg' : ''}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{plan.name}</span>
                            {plan.name === 'Pro' && (
                              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-6">
                            <p className="text-4xl font-bold">
                              R$ {plan.price}
                              <span className="text-lg text-gray-500 font-normal">/mês</span>
                            </p>
                            <p className="text-gray-600 mt-2">{plan.description}</p>
                          </div>
                          <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          {user.plan !== plan.name.toLowerCase() && (
                            <Button
                              variant={plan.name === 'Pro' ? 'primary' : 'outline'}
                              fullWidth
                            >
                              {plan.name === 'Pro' ? 'Fazer Upgrade' : 'Seu Plano Atual'}
                            </Button>
                          )}
                          {user.plan === plan.name.toLowerCase() && (
                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md text-center">
                              Plano Atual
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="pt-20 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, {user.name || 'usuário'}!</h1>
              <p className="text-gray-600 mt-1">Gerencie seus links e acompanhe suas estatísticas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Links Ativos</p>
                      <p className="text-2xl font-bold mt-1">1</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      <LinkIcon className="h-6 w-6 text-primary-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Cliques</p>
                      <p className="text-2xl font-bold mt-1">0</p>
                    </div>
                    <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center">
                      <BarChart className="h-6 w-6 text-accent-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Plano Atual</p>
                      <p className="text-2xl font-bold mt-1 capitalize">
                        {user.plan === 'free' ? 'Grátis' : 'Pro'}
                      </p>
                    </div>
                    {user.plan === 'free' && (
                      <Button variant="primary" size="sm" onClick={() => setShowPlans(true)}>
                        Fazer Upgrade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Seus Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-600 mb-4">
                    Você ainda não criou nenhum link
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleCreateFirstLink}
                    leftIcon={<MessageSquare size={18} />}
                  >
                    Criar Meu Primeiro Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}