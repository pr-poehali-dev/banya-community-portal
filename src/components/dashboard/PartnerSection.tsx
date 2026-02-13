import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { profileApi, PartnerProfile } from '@/lib/profile-api';
import { toast } from 'sonner';

export function PartnerSection() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    banya_name: '',
    banya_address: '',
    banya_description: '',
    banya_phone: '',
    banya_website: '',
    working_hours: '',
    amenities: '',
    price_range: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.getPartnerProfile();
      setProfile(data.partner_profile);
      setForm({
        banya_name: data.partner_profile.banya_name || '',
        banya_address: data.partner_profile.banya_address || '',
        banya_description: data.partner_profile.banya_description || '',
        banya_phone: data.partner_profile.banya_phone || '',
        banya_website: data.partner_profile.banya_website || '',
        working_hours: data.partner_profile.working_hours || '',
        amenities: data.partner_profile.amenities || '',
        price_range: data.partner_profile.price_range || '',
      });
    } catch {
      toast.error('Не удалось загрузить профиль партнёра');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.updatePartnerProfile(form);
      toast.success('Профиль партнёра сохранён');
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
          <h1 className="text-2xl font-bold text-foreground">Кабинет партнёра</h1>
          <p className="text-muted-foreground mt-1">Управление карточкой вашей бани</p>
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
            <Icon name="Building2" className="h-5 w-5 text-primary" />
            Информация о бане
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Название" value={profile?.banya_name} />
              <InfoRow label="Телефон" value={profile?.banya_phone} />
              <InfoRow label="Адрес" value={profile?.banya_address} />
              <InfoRow label="Сайт" value={profile?.banya_website} />
              <InfoRow label="Часы работы" value={profile?.working_hours} />
              <InfoRow label="Ценовой диапазон" value={profile?.price_range} />
              <div className="sm:col-span-2">
                <InfoRow label="Описание" value={profile?.banya_description} />
              </div>
              <div className="sm:col-span-2">
                <InfoRow label="Удобства" value={profile?.amenities} />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Название бани</Label>
                <Input value={form.banya_name} onChange={e => setForm({ ...form, banya_name: e.target.value })} placeholder="Баня на Лесной" />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input value={form.banya_phone} onChange={e => setForm({ ...form, banya_phone: e.target.value })} placeholder="+7 999 123-45-67" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Адрес</Label>
                <Input value={form.banya_address} onChange={e => setForm({ ...form, banya_address: e.target.value })} placeholder="г. Москва, ул. Лесная, 12" />
              </div>
              <div className="space-y-2">
                <Label>Сайт</Label>
                <Input value={form.banya_website} onChange={e => setForm({ ...form, banya_website: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Ценовой диапазон</Label>
                <Input value={form.price_range} onChange={e => setForm({ ...form, price_range: e.target.value })} placeholder="от 2 000 руб./час" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Часы работы</Label>
                <Input value={form.working_hours} onChange={e => setForm({ ...form, working_hours: e.target.value })} placeholder="Пн-Вс: 10:00 - 22:00" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Описание</Label>
                <Textarea value={form.banya_description} onChange={e => setForm({ ...form, banya_description: e.target.value })} placeholder="Расскажите о вашей бане..." rows={4} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Удобства</Label>
                <Textarea value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="Парилка, бассейн, комната отдыха, мангал..." rows={3} />
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

export default PartnerSection;
