import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Check, Link as LinkIcon, MessageSquare, Palette, Clock, Globe, Sparkles } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import PhoneInput from './ui/PhoneInput';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateLinkModal({ isOpen, onClose, onSuccess }: CreateLinkModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    whatsapp: '',
    message: 'Olá! Gostaria de mais informações.',
    bgColor: '#ffffff',
    btnColor: '#25D366',
    isScheduled: false,
    scheduleStart: '',
    scheduleEnd: '',
    redirect: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    }
    
    if (!formData.message) {
      newErrors.message = 'Mensagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        
        // Reset form
        setFormData({
          name: '',
          slug: '',
          whatsapp: '',
          message: 'Olá! Gostaria de mais informações.',
          bgColor: '#ffffff',
          btnColor: '#25D366',
          isScheduled: false,
          scheduleStart: '',
          scheduleEnd: '',
          redirect: '',
        });
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      setErrors({ form: 'Erro ao criar link. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const baseUrl = window.location.origin;

  const messageSuggestions = [
    "Olá! Vi seu link e gostaria de mais informações.",
    "Oi! Tenho interesse nos seus serviços/produtos.",
    "Olá! Gostaria de fazer um orçamento.",
    "Oi! Poderia me ajudar com algumas dúvidas?",
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar novo link">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 text-red-700 rounded-lg"
          >
            {errors.form}
          </motion.div>
        )}
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center mb-4">
              <LinkIcon className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="text-lg font-medium">Informações básicas</h3>
            </div>

            <Input
              label="Nome do link"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Link para Vendas"
              error={errors.name}
            />
            
            <div className="space-y-2">
              <Input
                label="Slug personalizado (opcional)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Ex: vendas"
                error={errors.slug}
              />
              <div className="text-sm text-gray-500 flex items-center space-x-2 bg-white p-2 rounded">
                <Globe className="w-4 h-4" />
                <span>Seu link:</span>
                <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                  {baseUrl}/l/{formData.slug || 'seu-link'}
                </code>
              </div>
            </div>
          </div>

          {/* WhatsApp Settings */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-5 h-5 text-whatsapp-500 mr-2" />
              <h3 className="text-lg font-medium">Configurações do WhatsApp</h3>
            </div>

            <PhoneInput
              label="Número do WhatsApp"
              value={formData.whatsapp}
              onChange={(value) => setFormData(prev => ({ ...prev, whatsapp: value }))}
              error={errors.whatsapp}
            />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Mensagem automática
                </label>
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <Sparkles size={16} className="mr-1" />
                  Sugestões
                </button>
              </div>
              
              <TextArea
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
              />

              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 mt-2"
                  >
                    {messageSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full text-left p-2 rounded hover:bg-white transition-colors text-sm text-gray-600"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, message: suggestion }));
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        
          {/* Premium Features */}
          {user?.plan === 'pro' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 space-y-6"
            >
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="text-lg font-medium">
                  Configurações avançadas
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Cor do fundo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="bgColor"
                      value={formData.bgColor}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border shadow-sm cursor-pointer"
                    />
                    <div 
                      className="flex-1 h-10 rounded-lg"
                      style={{ backgroundColor: formData.bgColor }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Cor do botão
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="btnColor"
                      value={formData.btnColor}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border shadow-sm cursor-pointer"
                    />
                    <div 
                      className="flex-1 h-10 rounded-lg"
                      style={{ backgroundColor: formData.btnColor }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isScheduled"
                    checked={formData.isScheduled}
                    onChange={(e) => setFormData(prev => ({ ...prev, isScheduled: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="isScheduled" className="text-sm font-medium text-gray-200 flex items-center">
                    <Clock size={16} className="mr-2" />
                    Agendar ativação do link
                  </label>
                </div>
                
                <AnimatePresence>
                  {formData.isScheduled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Input
                        type="datetime-local"
                        label="Início"
                        name="scheduleStart"
                        value={formData.scheduleStart}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      
                      <Input
                        type="datetime-local"
                        label="Fim"
                        name="scheduleEnd"
                        value={formData.scheduleEnd}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Input
                  label="Redirecionamento automático (opcional)"
                  name="redirect"
                  value={formData.redirect}
                  onChange={handleChange}
                  placeholder="https://seu-site.com"
                  leftIcon={<Globe size={18} />}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-sm text-gray-400">
                  Redirecione para seu site após o envio da mensagem
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Recursos premium disponíveis
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Desbloqueie personalização avançada, agendamento e mais
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      // Handle upgrade navigation
                    }}
                  >
                    Fazer upgrade
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-end pt-6 border-t">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Link criado com sucesso!
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex space-x-3"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="whatsapp"
                  size="lg"
                  isLoading={loading}
                >
                  Criar link
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Modal>
  );
}