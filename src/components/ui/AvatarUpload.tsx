import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from './Button';

interface AvatarUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function AvatarUpload({ value, onChange, size = 'md', disabled }: AvatarUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsLoading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }

      onChange(publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      setIsLoading(true);

      // Extract file path from URL
      const filePath = value.split('/').pop();
      if (!filePath) throw new Error('Invalid file path');

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`avatars/${filePath}`]);

      if (deleteError) {
        throw deleteError;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }

      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      alert('Erro ao remover a imagem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isLoading}
      />

      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <AnimatePresence>
              {isHovering && !disabled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Camera size={16} className="mr-1" />
                      Alterar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handleRemove}
                      disabled={isLoading}
                    >
                      <X size={16} className="mr-1" />
                      Remover
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className={`w-full h-full bg-gray-100 flex items-center justify-center
              ${!disabled && 'hover:bg-gray-200'} transition-colors rounded-full`}
          >
            {isLoading ? (
              <div className="animate-spin">
                <Upload size={24} className="text-gray-400" />
              </div>
            ) : (
              <Camera size={24} className="text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}