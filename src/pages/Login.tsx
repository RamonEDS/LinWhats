import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!formData.email) {
      setError('Por favor, insira seu email.');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, insira um email válido.');
      return false;
    }

    if (!formData.password) {
      setError('Por favor, insira sua senha.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await signIn(formData.email, formData.password);
      
      if (signInError) {
        setError(signInError.message);
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entrar na sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            criar uma conta gratuita
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
              {error.includes('incorretos') && (
                <p className="text-xs mt-1 text-red-600">
                  Esqueceu sua senha?{' '}
                  <Link to="/reset-password" className="underline">
                    Clique aqui
                  </Link>{' '}
                  para redefini-la.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError(''); // Clear error when user types
              }}
              leftIcon={<Mail size={18} />}
              required
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError(''); // Clear error when user types
              }}
              leftIcon={<Lock size={18} />}
              required
              autoComplete="current-password"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={loading}
              >
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}