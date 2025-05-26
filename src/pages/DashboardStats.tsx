import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, TrendingUp, Users, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function DashboardStats() {
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
          <BarChart className="h-8 w-8 text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Estatísticas</h2>
        <p className="text-gray-600 mt-1">Acompanhe o desempenho dos seus links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Cliques</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitantes Únicos</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-accent-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold mt-1">0s</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cliques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Nenhum dado disponível ainda
          </div>
        </CardContent>
      </Card>
    </div>
  );
}