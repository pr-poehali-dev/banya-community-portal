import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { authService } from '@/lib/auth';

interface Provider {
  provider: string;
  providerId: string;
  email: string | null;
  linkedAt: string;
}

interface ProviderConfig {
  name: string;
  icon: string;
  color: string;
  available: boolean;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  telegram: { name: 'Telegram', icon: 'Send', color: 'bg-[#2AABEE]', available: true },
  google: { name: 'Google', icon: 'Mail', color: 'bg-[#DB4437]', available: false },
  vk: { name: 'ВКонтакте', icon: 'Share2', color: 'bg-[#0077FF]', available: false },
  yandex: { name: 'Яндекс', icon: 'Chrome', color: 'bg-[#FC3F1D]', available: false },
  email: { name: 'Email/Пароль', icon: 'Lock', color: 'bg-gray-700', available: true },
};

export function LinkedAccountsSection() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch('https://functions.poehali.dev/649614a3-d46b-4fac-9521-83ad75a892c5', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load providers');
      const data = await response.json();
      setProviders(data.providers);
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить список провайдеров', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (provider: string) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `https://functions.poehali.dev/649614a3-d46b-4fac-9521-83ad75a892c5?provider=${provider}`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unlink provider');
      }
      toast({ title: 'Успешно', description: 'Провайдер отвязан' });
      loadProviders();
    } catch (error) {
      toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось отвязать провайдер', variant: 'destructive' });
    }
  };

  const handleLink = () => {
    toast({ title: 'В разработке', description: 'Функция привязки будет доступна после настройки OAuth' });
  };

  const isLinked = (providerKey: string) => providers.some((p) => p.provider === providerKey);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Привязанные аккаунты</h2>
        <p className="text-sm text-muted-foreground mt-1">Управляйте способами входа в ваш аккаунт</p>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          {Object.entries(PROVIDERS).map(([key, config]) => {
            const linked = isLinked(key);
            const linkedProvider = providers.find((p) => p.provider === key);

            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center`}>
                    <Icon name={config.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{config.name}</div>
                    {linked && linkedProvider?.email && (
                      <div className="text-sm text-muted-foreground">{linkedProvider.email}</div>
                    )}
                    {linked && !linkedProvider?.email && (
                      <div className="text-sm text-green-600">Привязан</div>
                    )}
                    {!config.available && !linked && (
                      <div className="text-xs text-muted-foreground">Скоро</div>
                    )}
                  </div>
                </div>

                <div>
                  {linked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlink(key)}
                      disabled={providers.length <= 1}
                    >
                      <Icon name="Unlink" className="mr-2 h-4 w-4" />
                      Отвязать
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLink()}
                      disabled={!config.available}
                    >
                      <Icon name="Link" className="mr-2 h-4 w-4" />
                      Привязать
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {providers.length <= 1 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
            <Icon name="AlertTriangle" className="inline mr-2 h-4 w-4" />
            У вас должен быть привязан хотя бы один способ входа
          </div>
        )}
      </Card>
    </div>
  );
}