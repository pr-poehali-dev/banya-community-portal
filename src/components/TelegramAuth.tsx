import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TelegramAuthProps {
  onSuccess: () => void;
}

export function TelegramAuth({ onSuccess }: TelegramAuthProps) {
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'sparkom_auth_bot';
  
  const handleTelegramAuth = () => {
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername.replace('_bot', '')}&origin=${encodeURIComponent(window.location.origin)}&return_to=${encodeURIComponent(window.location.href)}`;
    window.open(authUrl, '_blank', 'width=550,height=470');
  };

  return (
    <Button 
      onClick={handleTelegramAuth}
      className="w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white"
      size="lg"
    >
      <Icon name="Send" className="mr-2 h-5 w-5" />
      Войти через Telegram
    </Button>
  );
}