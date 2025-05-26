import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Check } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-whatsapp-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Planos e Preços
              </h1>
              <p className="text-lg text-gray-600">
                Escolha o plano ideal para suas necessidades
              </p>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`${plan.name === 'Pro' ? 'border-primary-500 shadow-xl' : ''}`}>
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
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <p className="text-4xl font-bold">
                        R$ {plan.price}
                        <span className="text-lg text-gray-500 font-normal">/mês</span>
                      </p>
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={plan.name === 'Pro' ? 'primary' : 'outline'}
                      size="lg"
                      fullWidth
                      onClick={() => navigate(plan.name === 'Pro' ? '/register?plan=pro' : '/register')}
                    >
                      {plan.name === 'Pro' ? 'Começar Agora' : 'Criar Conta Grátis'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}