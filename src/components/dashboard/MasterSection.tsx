import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { profileApi, MasterProfile } from '@/lib/profile-api';
import { toast } from 'sonner';

export function MasterSection() {
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    specialization: '',
    experience_years: '',
    description: '',
    services: '',
    price_range: '',
    certificates: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.getMasterProfile();
      setProfile(data.master_profile);
      setForm({
        specialization: data.master_profile.specialization || '',
        experience_years: data.master_profile.experience_years?.toString() || '',
        description: data.master_profile.description || '',
        services: data.master_profile.services || '',
        price_range: data.master_profile.price_range || '',
        certificates: data.master_profile.certificates || '',
      });
    } catch {
      toast.error('Не удалось загрузить профиль мастера');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.updateMasterProfile({
        ...form,
        experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      });
      toast.success('Профиль мастера сохранён');
      setEditing(false);
      loadProfile();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Кабинет мастера</h1>
          <p className="text-muted-foreground mt-1">Ваш профиль пармастера, услуги и расписание</p>
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
            <Icon name="Award" className="h-5 w-5 text-primary" />
            Профиль мастера
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Специализация" value={profile?.specialization} />
              <InfoRow label="Стаж (лет)" value={profile?.experience_years?.toString()} />
              <InfoRow label="Ценовой диапазон" value={profile?.price_range} />
              <InfoRow label="Сертификаты" value={profile?.certificates} />
              <div className="sm:col-span-2">
                <InfoRow label="Описание" value={profile?.description} />
              </div>
              <div className="sm:col-span-2">
                <InfoRow label="Услуги" value={profile?.services} />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Специализация</Label>
                <Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Пармастер, массаж, ароматерапия..." />
              </div>
              <div className="space-y-2">
                <Label>Опыт (лет)</Label>
                <Input type="number" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: e.target.value })} placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label>Ценовой диапазон</Label>
                <Input value={form.price_range} onChange={e => setForm({ ...form, price_range: e.target.value })} placeholder="от 3 000 руб." />
              </div>
              <div className="space-y-2">
                <Label>Сертификаты</Label>
                <Input value={form.certificates} onChange={e => setForm({ ...form, certificates: e.target.value })} placeholder="Какие сертификаты есть" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Описание</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Расскажите о себе как о мастере..." rows={4} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Услуги</Label>
                <Textarea value={form.services} onChange={e => setForm({ ...form, services: e.target.value })} placeholder="Перечислите услуги, которые предоставляете..." rows={3} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="Check" className="h-4 w-4 mr-2" />}
            Сохранить
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>Отмена</Button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-foreground whitespace-pre-line">{value || '—'}</p>
    </div>
  );
}

export default MasterSection;
