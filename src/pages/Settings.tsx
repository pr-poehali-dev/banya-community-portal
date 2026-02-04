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

export default function Settings() {
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load providers');

      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список провайдеров',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (provider: string) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `https://functions.poehali.dev/649614a3-d46b-4fac-9521-83ad75a892c5?provider=${provider}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unlink provider');
      }

      toast({
        title: 'Успешно',
        description: 'Провайдер отвязан',
      });

      loadProviders();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отвязать провайдер',
        variant: 'destructive',
      });
    }
  };

  const handleLink = (providerKey: string) => {
    toast({
      title: 'В разработке',
      description: 'Функция привязки будет доступна после настройки OAuth',
    });
  };

  const isLinked = (providerKey: string) => {
    return providers.some((p) => p.provider === providerKey);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="w-8 h-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">Настройки профиля</h1>
        <p className="text-gray-600 mb-8">Управляйте способами входа в ваш аккаунт</p>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Привязанные аккаунты</h2>
          <p className="text-sm text-gray-600 mb-6">
            Вы можете войти в систему через любой из привязанных способов
          </p>

          <div className="space-y-3">
            {Object.entries(PROVIDERS).map(([key, config]) => {
              const linked = isLinked(key);
              const linkedProvider = providers.find((p) => p.provider === key);

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center`}>
                      <Icon name={config.icon as any} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{config.name}</div>
                      {linked && linkedProvider?.email && (
                        <div className="text-sm text-gray-500">{linkedProvider.email}</div>
                      )}
                      {!config.available && (
                        <div className="text-xs text-gray-400">Скоро</div>
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
                        onClick={() => handleLink(key)}
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
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <Icon name="AlertTriangle" className="inline mr-2 h-4 w-4" />
              У вас должен быть привязан хотя бы один способ входа
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
