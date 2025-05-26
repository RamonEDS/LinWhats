import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Settings, BarChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  const handleCreateFirstLink = () => {
    navigate('/#create-form');
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              leftIcon={<Settings size={18} />}
            >
              Configurações
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Links Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold">1</div>
                  <MessageSquare className="h-8 w-8 text-whatsapp-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total de Cliques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold">0</div>
                  <BarChart className="h-8 w-8 text-primary-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold capitalize">
                    {user.plan === 'free' ? 'Grátis' : 'Pro'}
                  </div>
                  {user.plan === 'free' && (
                    <Button variant="primary" size="sm" onClick={handleUpgradeClick}>
                      Fazer Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Seus Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg mb-4">Você ainda não criou nenhum link</p>
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