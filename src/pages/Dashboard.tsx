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
  LogOut,
  Diamond,
  Zap,
  Shield,
  LineChart,
  Palette,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  // ... (código anterior mantido)

  const premiumFeatures = [
    {
      icon: <LineChart className="h-6 w-6 text-primary-500" />,
      title: "Estatísticas Avançadas",
      description: "Análise detalhada de cliques, conversões e comportamento"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Links Permanentes",
      description: "Seus links nunca expiram e ficam sempre disponíveis"
    },
    {
      icon: <Palette className="h-6 w-6 text-purple-500" />,
      title: "Personalização Total",
      description: "Customize cores, imagens e estilo da sua página"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Agendamento",
      description: "Programe horários específicos para seus links"
    }
  ];

  // ... (código anterior mantido até antes do return)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ... (código do sidebar mantido) */}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* ... (código do header e modal mantido) */}

        {/* Content */}
        <div className="pt-20 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* ... (código dos cards de estatísticas mantido) */}

            {/* Premium Upgrade Section - só mostra se não for premium */}
            {user.plan === 'free' && (
              <div className="mb-8">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
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
                          onClick={() => setShowPlans(true)}
                          leftIcon={<Zap size={20} />}
                          className="shadow-lg transform transition hover:scale-105"
                        >
                          Assine por apenas R$14,90/mês
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                        {premiumFeatures.map((feature, index) => (
                          <div
                            key={index}
                            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 flex items-start space-x-3"
                          >
                            <div className="flex-shrink-0">
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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