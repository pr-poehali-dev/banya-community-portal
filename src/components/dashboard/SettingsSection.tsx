import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

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

interface Props {
  onLogout: () => void;
}

export function SettingsSection({ onLogout }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      setProviders(data.providers);
    } catch {
      // silently fail
    } finally {
      setLoadingProviders(false);
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
        throw new Error(data.error || 'Failed');
      }
      toast({ title: 'Успешно', description: 'Провайдер отвязан' });
      loadProviders();
    } catch (error) {
      toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось отвязать', variant: 'destructive' });
    }
  };

  const isLinked = (key: string) => providers.some((p) => p.provider === key);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
        <p className="text-muted-foreground mt-1">Безопасность, привязанные аккаунты и управление профилем</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Link" className="h-5 w-5 text-primary" />
            Привязанные аккаунты
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProviders ? (
            <div className="flex justify-center py-4">
              <Icon name="Loader2" className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(PROVIDERS).map(([key, config]) => {
                const linked = isLinked(key);
                const linkedProvider = providers.find((p) => p.provider === key);

                return (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center`}>
                        <Icon name={config.icon} className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{config.name}</div>
                        {linked && linkedProvider?.email && (
                          <div className="text-xs text-muted-foreground">{linkedProvider.email}</div>
                        )}
                        {linked && !linkedProvider?.email && (
                          <div className="text-xs text-green-600">Привязан</div>
                        )}
                        {!config.available && !linked && (
                          <div className="text-xs text-muted-foreground">Скоро</div>
                        )}
                      </div>
                    </div>
                    {linked ? (
                      <Button variant="outline" size="sm" onClick={() => handleUnlink(key)} disabled={providers.length <= 1}>
                        Отвязать
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled={!config.available}>
                        Привязать
                      </Button>
                    )}
                  </div>
                );
              })}
              {providers.length <= 1 && (
                <p className="text-xs text-amber-600 mt-2">
                  Должен быть привязан хотя бы один способ входа
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Shield" className="h-5 w-5 text-primary" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Двухфакторная аутентификация</Label>
              <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
            </div>
            <Switch disabled />
          </div>
          <p className="text-xs text-muted-foreground">Скоро будет доступна</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Icon name="Trash2" className="h-5 w-5" />
            Удаление аккаунта
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Удаление аккаунта необратимо. Все ваши данные будут удалены.
              </p>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                Удалить аккаунт
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">Вы уверены?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Все данные будут безвозвратно удалены: профиль, бронирования, отзывы, избранное.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="destructive" size="sm">
                  Подтвердить удаление
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <Button variant="outline" onClick={onLogout} className="w-full">
            <Icon name="LogOut" className="h-4 w-4 mr-2" />
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
