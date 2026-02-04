import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/lib/auth';
import Icon from '@/components/ui/icon';

export default function TelegramCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Авторизация...');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Токен не найден');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const authenticate = async () => {
      try {
        const response = await fetch(
          'https://functions.poehali.dev/d7a17b5f-3b17-4c6b-9763-dfaea67d1074?action=callback',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        
        authService.saveToken(data.access_token);
        authService.saveUser(data.user);
        
        setStatus('success');
        setMessage('Успешно! Перенаправление...');
        
        setTimeout(() => navigate('/'), 1500);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Ошибка авторизации');
        setTimeout(() => navigate('/'), 2000);
      }
    };

    authenticate();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Icon name="Flame" className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">СПАРКОМ</h1>
        </div>

        <div className="space-y-4">
          {status === 'loading' && (
            <Icon name="Loader2" className="h-12 w-12 animate-spin mx-auto text-primary" />
          )}
          
          {status === 'success' && (
            <Icon name="CheckCircle2" className="h-12 w-12 mx-auto text-green-500" />
          )}
          
          {status === 'error' && (
            <Icon name="XCircle" className="h-12 w-12 mx-auto text-red-500" />
          )}

          <p className="text-lg text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
