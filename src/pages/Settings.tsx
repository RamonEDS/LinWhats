import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
      }));
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Simulando atualização para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Dados atualizados com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

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
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                    {success}
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                  />

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Alterar Senha
                    </h3>

                    <div className="space-y-4">
                      <Input
                        label="Senha Atual"
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        leftIcon={<Lock size={18} />}
                      />

                      <Input
                        label="Nova Senha"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        leftIcon={<Lock size={18} />}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
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

            <Card>
              <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium capitalize">
                      {user.plan === 'free' ? 'Plano Grátis' : 'Plano Pro'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.plan === 'free' 
                        ? 'Faça upgrade para ter acesso a mais recursos'
                        : 'Você tem acesso a todos os recursos'}
                    </p>
                  </div>
                  {user.plan === 'free' && (
                    <Button
                      variant="primary"
                      onClick={() => navigate('/upgrade')}
                    >
                      Fazer Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}