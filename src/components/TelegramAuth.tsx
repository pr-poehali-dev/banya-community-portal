import { useEffect, useRef } from 'react';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface TelegramAuthProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    TelegramLoginWidget?: {
      dataOnauth?: (user: any) => void;
    };
  }
}

export function TelegramAuth({ onSuccess }: TelegramAuthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'sparkom_auth_bot';

    window.TelegramLoginWidget = {
      dataOnauth: async (user: any) => {
        try {
          const response = await fetch('https://functions.poehali.dev/734d400e-e182-4b4c-850d-03beb8bfd313', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          });

          if (!response.ok) {
            throw new Error('Telegram auth failed');
          }

          const data = await response.json();
          authService.saveToken(data.token);
          
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
      },
    };

    if (containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botUsername);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      delete window.TelegramLoginWidget;
    };
  }, [onSuccess, toast]);

  return <div ref={containerRef} className="flex justify-center" />;
}
