import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock,
  Diamond,
  Zap,
  Shield,
  LineChart,
  Palette,
  Clock,
  Globe,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AvatarUpload from '../components/ui/AvatarUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function Settings() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    avatar: null as string | null,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || null,
      }));
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Dados atualizados com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const premiumFeatures = [
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Estatísticas Avançadas",
      description: "Análise detalhada de cliques e conversões",
      color: "text-primary-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Links Permanentes",
      description: "Seus links nunca expiram",
      color: "text-green-500"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Personalização Total",
      description: "Customize cores e estilos",
      color: "text-purple-500"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Agendamento",
      description: "Programe ativação dos links",
      color: "text-blue-500"
    }
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin">
          <User className="h-8 w-8 text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie suas preferências e dados da conta
              </p>
            </div>
            {user.plan === 'pro' && (
              <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full">
                <Diamond className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Premium Ativo</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Perfil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary-500" />
                    Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6 mb-6">
                    <AvatarUpload
                      value={formData.avatar}
                      onChange={(value) => setFormData(prev => ({ ...prev, avatar: value }))}
                      size="lg"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Membro desde {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      {success}
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Nome"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      leftIcon={<User size={18} />}
                    />

                    <Input
                      label="E-mail"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      leftIcon={<Mail size={18} />}
                      disabled
                    />

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSaving}
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Senha */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-primary-500" />
                    Alterar Senha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input
                      label="Senha atual"
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      leftIcon={<Lock size={18} />}
                    />

                    <Input
                      label="Nova senha"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      leftIcon={<Lock size={18} />}
                    />

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                      >
                        Alterar Senha
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plano */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {user.plan === 'pro' ? (
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Diamond className="h-8 w-8 text-yellow-400 mr-3" />
                      <div>
                        <h3 className="text-xl font-bold">Plano Premium Ativo</h3>
                        <p className="text-gray-300">
                          Aproveite todos os recursos premium
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-start justify-between">
                      <div className="mb-6 md:mb-0 md:mr-8">
                        <div className="flex items-center mb-4">
                          <Diamond className="h-8 w-8 text-yellow-400 mr-3" />
                          <h2 className="text-2xl font-bold">Desbloqueie todo o potencial</h2>
                        </div>
                        <p className="text-gray-600 mb-6 max-w-xl">
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
                          Fazer upgrade por R$14,90/mês
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}