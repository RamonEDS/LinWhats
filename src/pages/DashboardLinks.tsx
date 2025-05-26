import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function DashboardLinks() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

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
              <h1 className="text-2xl font-bold text-gray-900">Meus Links</h1>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              leftIcon={<Plus size={18} />}
            >
              Criar Link
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
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
                  onClick={() => navigate('/dashboard')}
                  leftIcon={<MessageSquare size={18} />}
                >
                  Criar Meu Primeiro Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}