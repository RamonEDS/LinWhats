import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/Card';
import { MessageSquare, Users, BarChart, Palette, Globe, QrCode } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-whatsapp-500" />,
      title: 'Links Personalizados',
      description: 'Crie links únicos para seu WhatsApp com mensagens pré-definidas para cada ocasião.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-500" />,
      title: 'Múltiplos Links',
      description: 'Crie diferentes links para diferentes propósitos ou campanhas.'
    },
    {
      icon: <BarChart className="h-8 w-8 text-accent-700" />,
      title: 'Análise de Cliques',
      description: 'Acompanhe quantas pessoas clicaram em seus links e de onde vieram.'
    },
    {
      icon: <Palette className="h-8 w-8 text-pink-500" />,
      title: 'Personalização Visual',
      description: 'Customize as cores, imagens e estilo da sua página de redirecionamento.'
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: 'Links para Redes Sociais',
      description: 'Adicione links para suas outras redes sociais na mesma página.'
    },
    {
      icon: <QrCode className="h-8 w-8 text-gray-700" />,
      title: 'QR Code Automático',
      description: 'Gere QR Codes para seus links e facilite o compartilhamento offline.'
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
                Recursos Poderosos para seu WhatsApp
              </h1>
              <p className="text-lg text-gray-600">
                Tudo que você precisa para criar uma presença profissional no WhatsApp
                e gerenciar seus contatos de forma eficiente.
              </p>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="transform transition-all hover:scale-105">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
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