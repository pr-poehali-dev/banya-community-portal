import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { profileApi } from '@/lib/profile-api';
import { toast } from 'sonner';

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  last_login_at: string | null;
  roles: string[];
}

interface PendingRequest {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  requested_at: string;
}

export function AdminSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await profileApi.getAdminUsers();
      setUsers(data.users);
      setPending(data.pending_requests);
    } catch {
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (roleId: number, approve: boolean) => {
    setProcessing(roleId);
    try {
      await profileApi.approveRole(roleId, approve);
      toast.success(approve ? 'Роль одобрена' : 'Запрос отклонён');
      loadData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setProcessing(null);
    }
  };

  const roleLabels: Record<string, string> = {
    participant: 'Участник',
    master: 'Мастер',
    partner: 'Партнёр',
    admin: 'Админ',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Администрирование</h1>
        <p className="text-muted-foreground mt-1">Управление пользователями и ролями</p>
      </div>

      {pending.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Icon name="Bell" className="h-5 w-5" />
              Заявки на роли ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{req.full_name}</p>
                  <p className="text-sm text-muted-foreground">{req.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Запрашивает роль: <span className="font-medium">{roleLabels[req.role] || req.role}</span>
                    {' '}&middot; {new Date(req.requested_at).toLocaleDateString('ru')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(req.id, true)}
                    disabled={processing === req.id}
                  >
                    {processing === req.id ? <Icon name="Loader2" className="h-4 w-4 animate-spin" /> : <Icon name="Check" className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(req.id, false)}
                    disabled={processing === req.id}
                  >
                    <Icon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Users" className="h-5 w-5 text-primary" />
            Пользователи ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((u, i) => (
              <div key={u.id}>
                {i > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{u.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Зарегистрирован: {new Date(u.created_at).toLocaleDateString('ru')}
                      {u.last_login_at && ` | Был: ${new Date(u.last_login_at).toLocaleDateString('ru')}`}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {u.roles?.filter(r => r).map((roleStr, idx) => {
                      const [role, active] = roleStr.split(':');
                      return (
                        <Badge
                          key={idx}
                          variant={active === 'true' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {roleLabels[role] || role}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSection;
