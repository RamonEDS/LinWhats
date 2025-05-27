import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';

export default function LinkPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<any>(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        // TODO: Implement link fetching from Supabase
        setLoading(false);
      } catch (err) {
        setError('Link not found');
        setLoading(false);
      }
    };

    fetchLink();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link not found</h1>
          <p className="text-gray-600 mb-4">This link may have been removed or is no longer active.</p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: link.bgColor || '#ffffff' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{link.name}</h1>
          {link.message && (
            <p className="text-gray-600">{link.message}</p>
          )}
        </div>

        <Button
          variant="whatsapp"
          fullWidth
          size="lg"
          onClick={() => window.location.href = `https://wa.me/${link.whatsapp}?text=${encodeURIComponent(link.message || '')}`}
          style={{ backgroundColor: link.btnColor || '#25D366' }}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Open in WhatsApp
        </Button>
      </div>
    </div>
  );
}