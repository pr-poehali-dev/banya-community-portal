import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function TelegramSetup() {
  const [loading, setLoading] = useState(false);
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const SETUP_URL = 'https://functions.poehali.dev/663549b4-0da1-4264-b2e4-33e5e4da01b2';

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${SETUP_URL}?action=${action}`);
      const data = await response.json();

      if (action === 'info') {
        setWebhookInfo(data);
      } else {
        toast({
          title: data.success ? 'Успешно!' : 'Ошибка',
          description: data.description || JSON.stringify(data),
          variant: data.success ? 'default' : 'destructive',
        });
        
        if (data.success && action === 'setup') {
          // Обновляем информацию после установки
          setTimeout(() => handleAction('info'), 1000);
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Произошла ошибка',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Icon name="ArrowLeft" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Настройка Telegram Бота</h1>
            <p className="text-muted-foreground">Управление webhook для авторизации</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Действия</CardTitle>
            <CardDescription>
              Управление webhook для получения сообщений от бота
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleAction('setup')}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Icon name="Link" className="h-4 w-4 mr-2" />
              )}
              Установить Webhook
            </Button>

            <Button
              onClick={() => handleAction('info')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Icon name="Info" className="h-4 w-4 mr-2" />
              Проверить статус
            </Button>

            <Button
              onClick={() => handleAction('delete')}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              <Icon name="Trash2" className="h-4 w-4 mr-2" />
              Удалить Webhook
            </Button>
          </CardContent>
        </Card>

        {webhookInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Информация о Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div>
                  <span className="text-muted-foreground">URL:</span>{' '}
                  <span className="break-all">{webhookInfo.url || 'не установлен'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ожидающих обновлений:</span>{' '}
                  {webhookInfo.pending_update_count || 0}
                </div>
                {webhookInfo.last_error_date && (
                  <div>
                    <span className="text-muted-foreground">Последняя ошибка:</span>{' '}
                    {webhookInfo.last_error_message}
                  </div>
                )}
                {webhookInfo.ip_address && (
                  <div>
                    <span className="text-muted-foreground">IP адрес:</span>{' '}
                    {webhookInfo.ip_address}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-base">Инструкция</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>1. <strong>Установить Webhook</strong> - настроить получение сообщений от бота</p>
            <p>2. <strong>Проверить статус</strong> - убедиться что webhook работает</p>
            <p>3. Теперь при нажатии "Войти через Telegram" бот будет отправлять ссылку для входа</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
