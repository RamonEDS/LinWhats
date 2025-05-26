import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ArrowLeft, 
  Plus, 
  Copy, 
  ExternalLink, 
  Edit, 
  Trash2,
  Check,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import CreateLinkModal from '../components/CreateLinkModal';

interface Link {
  id: string;
  name: string;
  slug: string;
  whatsapp: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

export default function DashboardLinks() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleCopyLink = (id: string, slug: string) => {
    const url = `${window.location.origin}/l/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSuccess = (newLink: Link) => {
    setLinks(prev => [newLink, ...prev]);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                leftIcon={<ArrowLeft size={18} />}
                className="mr-4"
              >
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meus Links</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {links.length === 0 
                    ? 'Crie seu primeiro link personalizado'
                    : `Você tem ${links.length} link${links.length > 1 ? 's' : ''} criado${links.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus size={18} />}
            >
              Criar Link
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <AnimatePresence mode="wait">
            {links.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
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
                        onClick={() => setIsCreateModalOpen(true)}
                        leftIcon={<MessageSquare size={18} />}
                      >
                        Criar Meu Primeiro Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4"
              >
                {links.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                              <LinkIcon className="w-6 h-6 text-primary-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {link.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {window.location.origin}/l/{link.slug}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyLink(link.id, link.slug)}
                              leftIcon={copiedId === link.id ? <Check size={16} /> : <Copy size={16} />}
                              className={copiedId === link.id ? 'text-green-600 border-green-600' : ''}
                            >
                              {copiedId === link.id ? 'Copiado!' : 'Copiar'}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/l/${link.slug}`, '_blank')}
                              leftIcon={<ExternalLink size={16} />}
                            >
                              Visualizar
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {/* Handle edit */}}
                              leftIcon={<Edit size={16} />}
                            >
                              Editar
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => {/* Handle delete */}}
                              leftIcon={<Trash2 size={16} />}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {link.clicks}
                            </p>
                            <p className="text-sm text-gray-500">Cliques totais</p>
                          </div>
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {link.isActive ? (
                                <span className="text-green-600">Ativo</span>
                              ) : (
                                <span className="text-red-600">Inativo</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">Status</p>
                          </div>
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">Data de criação</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}