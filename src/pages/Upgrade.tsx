import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Check, Zap, Shield, LineChart, Palette, Clock, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function Upgrade() {
  const navigate = useNavigate();

  const features = [
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

  const benefits = [
    "Links ilimitados",
    "Personalização completa",
    "QR Code personalizado",
    "Estatísticas avançadas",
    "Múltiplos números",
    "Remoção da marca",
    "Suporte prioritário",
    "Agendamento de links",
    "Redirecionamento automático",
    "Backup automático"
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft size={18} />}
              className="mr-4"
            >
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upgrade para Premium</h1>
              <p className="mt-1 text-sm text-gray-500">
                Desbloqueie todos os recursos e potencialize seus resultados
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <div className="flex items-center mb-4">
                        <Diamond className="h-8 w-8 text-yellow-400 mr-3" />
                        <h2 className="text-2xl font-bold">Plano Premium</h2>
                      </div>
                      <p className="text-gray-300 mb-6 max-w-xl">
                        Aprimore sua presença no WhatsApp com recursos exclusivos e análises avançadas.
                        Transforme visitantes em clientes com nossa solução profissional.
                      </p>
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">R$14,90</span>
                          <span className="text-gray-400 ml-2">/mês</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Cancele a qualquer momento
                        </p>
                      </div>
                      <Button
                        variant="whatsapp"
                        size="lg"
                        onClick={() => {
                          // Aqui você implementaria a integração com o Stripe
                          alert('Integração com pagamento será implementada em breve!');
                        }}
                        leftIcon={<Zap size={20} />}
                        className="shadow-lg transform transition hover:scale-105"
                      >
                        Fazer upgrade agora
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                      {features.map((feature, index) => (
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

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Tudo incluído no plano Premium
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Perguntas Frequentes
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Como funciona o período de teste?
                      </h4>
                      <p className="text-gray-600">
                        Você tem 7 dias para testar todos os recursos premium sem compromisso.
                        Cancele a qualquer momento durante este período sem custos.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Posso cancelar a qualquer momento?
                      </h4>
                      <p className="text-gray-600">
                        Sim! Não há contratos longos. Cancele sua assinatura quando quiser
                        e você só paga pelo período utilizado.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Como funciona o pagamento?
                      </h4>
                      <p className="text-gray-600">
                        Aceitamos cartões de crédito e débito. O pagamento é processado
                        de forma segura através do Stripe.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}