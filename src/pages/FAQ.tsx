import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/Card';

export default function FAQ() {
  const faqs = [
    {
      question: 'O que é o LinkWhats?',
      answer: 'O LinkWhats é uma plataforma que permite criar links personalizados para o WhatsApp com mensagens pré-definidas, facilitando o primeiro contato dos seus clientes.'
    },
    {
      question: 'É gratuito?',
      answer: 'Sim! Oferecemos um plano gratuito com recursos básicos. Para funcionalidades avançadas, temos planos premium com mais recursos.'
    },
    {
      question: 'Posso personalizar minha página?',
      answer: 'Sim! Você pode personalizar cores, adicionar sua logo, links para redes sociais e muito mais.'
    },
    {
      question: 'Como funciona o rastreamento de cliques?',
      answer: 'Cada vez que alguém clica no seu link, registramos informações como data, hora e origem do clique, permitindo que você acompanhe o desempenho.'
    },
    {
      question: 'Posso ter múltiplos números de WhatsApp?',
      answer: 'Sim! Com nossa conta premium, você pode criar links para diferentes números de WhatsApp.'
    },
    {
      question: 'É seguro usar o LinkWhats?',
      answer: 'Sim! Não armazenamos mensagens ou conversas do WhatsApp, apenas facilitamos o primeiro contato através do link personalizado.'
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
                Perguntas Frequentes
              </h1>
              <p className="text-lg text-gray-600">
                Encontre respostas para as dúvidas mais comuns sobre o LinkWhats
              </p>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">
                      {faq.answer}
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