import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Check } from 'lucide-react';
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
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
        });
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      setErrors({ form: 'Erro ao criar link. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };
  
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
        
        <Input
          label="Nome do link"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Link para Vendas"
          error={errors.name}
        />
        
        <Input
          label="Slug personalizado (opcional)"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Ex: vendas"
          error={errors.slug}
        />
        
        <PhoneInput
          label="Número do WhatsApp"
          value={formData.whatsapp}
          onChange={(value) => setFormData(prev => ({ ...prev, whatsapp: value }))}
          error={errors.whatsapp}
        />
        
        <TextArea
          label="Mensagem automática"
          name="message"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
        />
        
        {/* Premium Features */}
        {user?.plan === 'pro' ? (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Configurações avançadas
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="color"
                label="Cor do fundo"
                name="bgColor"
                value={formData.bgColor}
                onChange={handleChange}
              />
              
              <Input
                type="color"
                label="Cor do botão"
                name="btnColor"
                value={formData.btnColor}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isScheduled"
                checked={formData.isScheduled}
                onChange={(e) => setFormData(prev => ({ ...prev, isScheduled: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isScheduled" className="text-sm text-gray-700">
                Agendar ativação
              </label>
            </div>
            
            {formData.isScheduled && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  label="Início"
                  name="scheduleStart"
                  value={formData.scheduleStart}
                  onChange={handleChange}
                />
                
                <Input
                  type="datetime-local"
                  label="Fim"
                  name="scheduleEnd"
                  value={formData.scheduleEnd}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">
                Recursos avançados disponíveis no plano Premium
              </span>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center text-green-600 font-medium"
              >
                <Check className="w-5 h-5 mr-2" />
                Link criado com sucesso!
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Button
                  type="submit"
                  variant="whatsapp"
                  size="lg"
                  isLoading={loading}
                >
                  Salvar link
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Modal>
  );
}