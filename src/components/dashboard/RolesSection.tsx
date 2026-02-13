import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { profileApi, DashboardData } from '@/lib/profile-api';
import { toast } from 'sonner';

interface Props {
  dashboard: DashboardData;
  onUpdate: () => void;
}

const ROLE_INFO: Record<string, { label: string; icon: string; description: string }> = {
  participant: {
    label: 'Участник',
    icon: 'Users',
    description: 'Записывайтесь на события, оставляйте отзывы, общайтесь в сообществе.',
  },
  master: {
    label: 'Мастер',
    icon: 'Award',
    description: 'Заполните расширенный профиль, управляйте расписанием и услугами, принимайте записи.',
  },
  partner: {
    label: 'Партнёр (Владелец бани)',
    icon: 'Building2',
    description: 'Управляйте карточкой бани в каталоге, обновляйте условия и расписание.',
  },
  admin: {
    label: 'Администратор',
    icon: 'Settings',
    description: 'Полный доступ к управлению контентом, пользователями и модерацией.',
  },
};

export function RolesSection({ dashboard, onUpdate }: Props) {
  const [requesting, setRequesting] = useState<string | null>(null);

  const roleMap = new Map(dashboard.roles.map(r => [r.role, r]));

  const handleRequest = async (role: string) => {
    setRequesting(role);
    try {
      await profileApi.requestRole(role);
      toast.success('Запрос отправлен. Администратор рассмотрит вашу заявку.');
      onUpdate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setRequesting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Мои роли</h1>
        <p className="text-muted-foreground mt-1">Управляйте доступами и запрашивайте новые роли</p>
      </div>

      <div className="grid gap-4">
        {(['participant', 'master', 'partner', 'admin'] as const).map(roleKey => {
          const info = ROLE_INFO[roleKey];
          const userRole = roleMap.get(roleKey);
          const isActive = userRole?.is_active;
          const isPending = userRole && !userRole.is_active && !userRole.approved_at;
          const canRequest = roleKey !== 'admin' && roleKey !== 'participant' && !userRole;

          return (
            <Card key={roleKey} className={isActive ? 'border-primary/30' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name={info.icon} className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-lg">{info.label}</span>
                  </div>
                  {isActive && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активна</Badge>}
                  {isPending && <Badge variant="outline" className="border-yellow-400 text-yellow-700">На рассмотрении</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                {canRequest && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRequest(roleKey)}
                    disabled={requesting === roleKey}
                  >
                    {requesting === roleKey
                      ? <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      : <Icon name="Plus" className="h-4 w-4 mr-2" />
                    }
                    Запросить роль
                  </Button>
                )}
                {isPending && (
                  <p className="text-xs text-yellow-600">
                    Заявка отправлена {userRole.requested_at ? new Date(userRole.requested_at).toLocaleDateString('ru') : ''}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default RolesSection;
