import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Settings, BarChart, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showPlans, setShowPlans] = useState(false);

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
      {/* Modal de Planos */}
      {showPlans && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          </div>
        </div>
      )}

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
                    <Button variant="primary" size="sm" onClick={() => setShowPlans(true)}>
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