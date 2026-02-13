import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { profileApi, DashboardData } from '@/lib/profile-api';
import { toast } from 'sonner';

interface Props {
  dashboard: DashboardData;
  onUpdate: () => void;
}

export function ProfileSection({ dashboard, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: dashboard.user.full_name || '',
    phone: dashboard.user.phone || '',
    bio: dashboard.profile?.bio || '',
    city: dashboard.profile?.city || '',
    birth_date: dashboard.profile?.birth_date || '',
    gender: dashboard.profile?.gender || '',
    social_telegram: dashboard.profile?.social_telegram || '',
    social_instagram: dashboard.profile?.social_instagram || '',
    social_vk: dashboard.profile?.social_vk || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.updateProfile(form);
      toast.success('Профиль сохранён');
      setEditing(false);
      onUpdate();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const activeRoles = dashboard.roles
    .filter(r => r.is_active)
    .map(r => {
      const labels: Record<string, string> = {
        participant: 'Участник',
        master: 'Мастер',
        partner: 'Партнёр',
        admin: 'Администратор',
      };
      return labels[r.role] || r.role;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Мой профиль</h1>
          <p className="text-muted-foreground mt-1">Информация о вас, видимая другим участникам</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)} variant="outline">
            <Icon name="Pencil" className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" className="h-5 w-5 text-primary" />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Имя" value={dashboard.user.full_name} />
              <InfoRow label="Email" value={dashboard.user.email} />
              <InfoRow label="Телефон" value={dashboard.user.phone} />
              <InfoRow label="Город" value={dashboard.profile?.city} />
              <InfoRow label="Пол" value={genderLabel(dashboard.profile?.gender)} />
              <InfoRow label="Дата рождения" value={dashboard.profile?.birth_date} />
              <InfoRow label="Роли" value={activeRoles.join(', ')} />
              {dashboard.user.telegram_id && (
                <InfoRow label="Telegram" value="Подключён" />
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Имя</Label>
                <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+7 999 123-45-67" />
              </div>
              <div className="space-y-2">
                <Label>Город</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Москва" />
              </div>
              <div className="space-y-2">
                <Label>Пол</Label>
                <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Не указан" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Мужской</SelectItem>
                    <SelectItem value="female">Женский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Дата рождения</Label>
                <Input type="date" value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" className="h-5 w-5 text-primary" />
                О себе
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Расскажите о себе..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Share2" className="h-5 w-5 text-primary" />
                Социальные сети
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Telegram</Label>
                <Input value={form.social_telegram} onChange={e => setForm({ ...form, social_telegram: e.target.value })} placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input value={form.social_instagram} onChange={e => setForm({ ...form, social_instagram: e.target.value })} placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label>ВКонтакте</Label>
                <Input value={form.social_vk} onChange={e => setForm({ ...form, social_vk: e.target.value })} placeholder="https://vk.com/..." />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="Check" className="h-4 w-4 mr-2" />}
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Отмена</Button>
          </div>
        </>
      )}

      {!editing && dashboard.profile?.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="FileText" className="h-5 w-5 text-primary" />
              О себе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{dashboard.profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {!editing && (dashboard.profile?.social_telegram || dashboard.profile?.social_instagram || dashboard.profile?.social_vk) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Share2" className="h-5 w-5 text-primary" />
              Социальные сети
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {dashboard.profile.social_telegram && <InfoRow label="Telegram" value={dashboard.profile.social_telegram} />}
            {dashboard.profile.social_instagram && <InfoRow label="Instagram" value={dashboard.profile.social_instagram} />}
            {dashboard.profile.social_vk && <InfoRow label="ВКонтакте" value={dashboard.profile.social_vk} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-foreground">{value || '—'}</p>
    </div>
  );
}

function genderLabel(g: string | null | undefined) {
  if (g === 'male') return 'Мужской';
  if (g === 'female') return 'Женский';
  return null;
}

export default ProfileSection;
