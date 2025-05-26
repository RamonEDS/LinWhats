import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  BarChart,
  Users,
  Diamond,
  Zap,
  Shield,
  LineChart,
  Palette,
  Clock,
  Lock,
  ChevronRight,
  Link as LinkIcon,
  Plus,
  Copy,
  ExternalLink,
  Edit,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import CreateLinkModal from '../components/CreateLinkModal';
import DashboardLayout from '../components/layout/DashboardLayout';

interface Link {
  id: string;
  name: string;
  slug: string;
  whatsapp: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showPlans, setShowPlans] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleCreateFirstLink = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (newLink: Link) => {
    setLinks(prev => [newLink, ...prev]);
  };

  const handleCopyLink = (id: string, slug: string) => {
    const url = `${window.location.origin}/l/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = [
    {
      title: "Total de Cliques",
      value: "0",
      icon: <BarChart className="h-6 w-6 text-primary-500" />,
      isPremium: false
    },
    {
      title: "Links Ativos",
      value: String(links.length),
      icon: <LinkIcon className="h-6 w-6 text-accent-500" />,
      isPremium: false
    },
    {
      title: "Visitantes Únicos",
      value: "Premium",
      icon: <Users className="h-6 w-6 text-gray-400" />,
      isPremium: true
    }
  ];

  const premiumFeatures = [
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Estatísticas Avançadas",
      description: "Análise detalhada de cliques, conversões e comportamento",
      color: "text-primary-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Links Permanentes",
      description: "Seus links nunca expiram e ficam sempre disponíveis",
      color: "text-green-500"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Personalização Total",
      description: "Customize cores, imagens e estilo da sua página",
      color: "text-purple-500"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Agendamento Inteligente",
      description: "Programe horários específicos para seus links",
      color: "text-blue-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin">
          <MessageSquare className="h-8 w-8 text-whatsapp-500" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header with Premium Badge */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus size={18} />}
              >
                Criar Link
              </Button>
              {user?.plan === 'pro' && (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full">
                  <Diamond className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Premium Ativo</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={stat.isPremium && user?.plan !== 'pro' ? 'bg-gray-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <div className="flex items-center mt-1">
                          {stat.isPremium && user?.plan !== 'pro' ? (
                            <Lock className="h-5 w-5 text-gray-400 mr-2" />
                          ) : null}
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        stat.isPremium && user?.plan !== 'pro' ? 'bg-gray-100' : 'bg-primary-50'
                      }`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Premium Upgrade Section */}
          {user?.plan !== 'pro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <div className="flex items-center mb-4">
                        <Diamond className="h-8 w-8 text-yellow-400 mr-3" />
                        <h2 className="text-2xl font-bold">Desbloqueie todo o potencial do LinkWhats</h2>
                      </div>
                      <p className="text-gray-300 mb-6 max-w-xl">
                        Aprimore sua presença no WhatsApp com recursos exclusivos e análises avançadas.
                        Transforme visitantes em clientes com nossa solução profissional.
                      </p>
                      <Button
                        variant="whatsapp"
                        size="lg"
                        onClick={() => navigate('/upgrade')}
                        leftIcon={<Zap size={20} />}
                        className="shadow-lg transform transition hover:scale-105"
                      >
                        Assinar por apenas R$14,90/mês
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                      {premiumFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 flex items-start space-x-3"
                        >
                          <div className={`flex-shrink-0 ${feature.color}`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Seus Links</CardTitle>
                {links.length > 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard/links')}
                  >
                    Ver Todos
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {links.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-12"
                    >
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
                    </motion.div>
                  ) : (
                    <div className="grid gap-4">
                      {links.slice(0, 4).map((link, index) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                                    <LinkIcon className="w-6 h-6 text-primary-500" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                      {link.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {window.location.origin}/l/{link.slug}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopyLink(link.id, link.slug)}
                                    leftIcon={copiedId === link.id ? <Check size={16} /> : <Copy size={16} />}
                                    className={copiedId === link.id ? 'text-green-600 border-green-600' : ''}
                                  >
                                    {copiedId === link.id ? 'Copiado!' : 'Copiar'}
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/l/${link.slug}`, '_blank')}
                                    leftIcon={<ExternalLink size={16} />}
                                  >
                                    Visualizar
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {/* Handle edit */}}
                                    leftIcon={<Edit size={16} />}
                                  >
                                    Editar
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => {/* Handle delete */}}
                                    leftIcon={<Trash2 size={16} />}
                                  >
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-2xl font-semibold text-gray-900">
                                    {link.clicks}
                                  </p>
                                  <p className="text-sm text-gray-500">Cliques totais</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-semibold text-gray-900">
                                    {link.isActive ? (
                                      <span className="text-green-600">Ativo</span>
                                    ) : (
                                      <span className="text-red-600">Inativo</span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">Status</p>
                                </div>
                                <div>
                                  <p className="text-2xl font-semibold text-gray-900">
                                    {new Date(link.createdAt).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">Data de criação</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </DashboardLayout>
  );
}