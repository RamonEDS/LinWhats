import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, Copy, Check, Smartphone, Users, ShieldCheck, Zap, BarChart, Palette, Globe, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { generateWhatsAppLink, isValidPhoneNumber, isValidSlug } from '../lib/utils';
import { api } from '../lib/api';

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    slug: '',
    whatsapp: '',
    message: 'Olá! Gostaria de mais informações.',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.slug) {
      newErrors.slug = 'Username is required';
    } else if (!isValidSlug(formData.slug)) {
      newErrors.slug = 'Username can only contain letters, numbers, and hyphens';
    }
    
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!isValidPhoneNumber(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid phone number with country code';
    }
    
    if (!formData.message) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await api.createLink(formData);
      const baseUrl = window.location.origin;
      const generatedLink = `${baseUrl}/l/${formData.slug}`;
      setCreatedLink(generatedLink);
      setLinkCreated(true);
    } catch (error) {
      console.error('Error creating link:', error);
      setErrors({ form: 'Failed to create link. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAIGenerate = async () => {
    const profession = prompt('What do you do? (e.g., "I am a personal trainer")');
    if (!profession) return;
    
    try {
      const suggestedMessage = await api.generateSuggestedMessage(profession);
      setFormData(prev => ({ ...prev, message: suggestedMessage }));
    } catch (error) {
      console.error('Error generating message:', error);
    }
  };
  
  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const viewLink = () => {
    if (createdLink) {
      window.open(`/l/${formData.slug}`, '_blank');
    }
  };

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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-whatsapp-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-10 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Create Custom WhatsApp Links <span className="text-whatsapp-500">in Seconds</span>
                  </h1>
                  <p className="text-lg text-gray-600 mb-8 max-w-xl">
                    Generate personalized WhatsApp links with pre-written messages. Perfect for businesses and professionals to engage with customers instantly.
                  </p>
                  
                  {!linkCreated ? (
                    <Card className="bg-white rounded-xl overflow-hidden border-0 shadow-xl">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Create Your WhatsApp Link</h2>
                        
                        {errors.form && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                            {errors.form}
                          </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <Input
                            label="Choose a username for your link"
                            placeholder="yourname"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            leftIcon={<Users size={18} />}
                            error={errors.slug}
                            required
                          />
                          
                          <div className="text-xs text-gray-500 -mt-3">
                            Your link will be: {window.location.origin}/l/<span className="font-medium">{formData.slug || 'yourname'}</span>
                          </div>
                          
                          <Input
                            label="WhatsApp Number (with country code)"
                            placeholder="+1234567890"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            leftIcon={<Phone size={18} />}
                            error={errors.whatsapp}
                            required
                          />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Automatic Message
                              </label>
                              <button
                                type="button"
                                onClick={handleAIGenerate}
                                className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                              >
                                <Zap size={14} className="mr-1" />
                                Generate with AI
                              </button>
                            </div>
                            
                            <TextArea
                              placeholder="Hello! I'm interested in your services..."
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              error={errors.message}
                              required
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            variant="whatsapp" 
                            size="lg" 
                            fullWidth
                            isLoading={loading}
                            leftIcon={<MessageSquare size={20} />}
                          >
                            Create My Free WhatsApp Link
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-white rounded-xl overflow-hidden border-0 shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-whatsapp-500" />
                          </div>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-center mb-2">Your Link is Ready!</h2>
                        <p className="text-gray-500 text-center mb-6">Share it with your audience to start conversations</p>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                type="text"
                                value={createdLink}
                                readOnly
                                className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 pr-10 font-medium"
                              />
                              <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                title="Copy to clipboard"
                              >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                              </button>
                            </div>
                            
                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                              <Button
                                variant="whatsapp"
                                fullWidth
                                onClick={viewLink}
                                leftIcon={<Smartphone size={18} />}
                              >
                                View Your Page
                              </Button>
                              
                              <Button
                                variant="outline"
                                fullWidth
                                onClick={() => navigate('/register')}
                              >
                                Sign up to Customize
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 bg-white p-3 border border-gray-200 rounded-md">
                            <QRCodeSVG
                              value={createdLink || ''}
                              size={150}
                              level="H"
                              includeMargin={false}
                              bgColor="#FFFFFF"
                              fgColor="#000000"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </div>
              
              <div className="w-full md:w-1/2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img 
                    src="https://images.pexels.com/photos/5899244/pexels-photo-5899244.jpeg" 
                    alt="WhatsApp messaging" 
                    className="rounded-lg shadow-2xl max-w-full h-auto"
                    width={550}
                    height={412}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recursos Poderosos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tudo que você precisa para criar uma presença profissional no WhatsApp
                e gerenciar seus contatos de forma eficiente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full transform transition-all hover:scale-105">
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Escolha o plano ideal para suas necessidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className={`${plan.name === 'Pro' ? 'border-primary-500 shadow-xl' : ''}`}>
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50" id="faq">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encontre respostas para as dúvidas mais comuns sobre o LinkWhats
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to grow your business with WhatsApp?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of businesses that use LinkWhats to connect with customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="whatsapp"
                size="lg"
                onClick={() => document.getElementById('create-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Create Free Link
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}