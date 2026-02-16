import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { DashboardData } from '@/lib/profile-api';

interface Props {
  dashboard: DashboardData;
}

export function NotificationsSection({ dashboard }: Props) {
  const [channels, setChannels] = useState({
    email: true,
    telegram: !!dashboard.user.telegram_id,
  });

  const toggleChannel = (channel: 'email' | 'telegram') => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Уведомления</h1>
        <p className="text-muted-foreground mt-1">История и настройка каналов уведомлений</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings" className="h-5 w-5 text-primary" />
            Каналы уведомлений
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="Mail" className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Label className="font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{dashboard.user.email}</p>
              </div>
            </div>
            <Switch checked={channels.email} onCheckedChange={() => toggleChannel('email')} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <Icon name="Send" className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <Label className="font-medium">Telegram</Label>
                <p className="text-sm text-muted-foreground">
                  {dashboard.user.telegram_id ? 'Подключён' : 'Не подключён'}
                </p>
              </div>
            </div>
            <Switch
              checked={channels.telegram}
              onCheckedChange={() => toggleChannel('telegram')}
              disabled={!dashboard.user.telegram_id}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bell" className="h-5 w-5 text-primary" />
            История уведомлений
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="BellOff" className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Нет уведомлений</p>
            <p className="text-sm text-muted-foreground mt-1">Здесь будут отображаться ваши уведомления</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
