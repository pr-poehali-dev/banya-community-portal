import { useEffect, useRef } from 'react';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface TelegramAuthProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export function TelegramAuth({ onSuccess }: TelegramAuthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'sparkom_auth_bot';

  useEffect(() => {
    window.onTelegramAuth = async (user: any) => {
      try {
        const response = await fetch('https://functions.poehali.dev/b1d4b2b5-cc9f-4029-86b6-b5a6fe639456?action=telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        authService.saveToken(data.token);
        authService.saveUser(data.user);

        toast({
          title: 'Успешно!',
          description: 'Вы вошли через Telegram',
        });

        onSuccess();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось войти через Telegram',
          variant: 'destructive',
        });
      }
    };

    if (containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botUsername);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '8');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      delete window.onTelegramAuth;
    };
  }, [botUsername, onSuccess, toast]);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} className="telegram-login-button" />
    </div>
  );
}