import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { profileApi, DashboardData } from '@/lib/profile-api';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProfileSection } from '@/components/dashboard/ProfileSection';
import { RolesSection } from '@/components/dashboard/RolesSection';
import { MasterSection } from '@/components/dashboard/MasterSection';
import { PartnerSection } from '@/components/dashboard/PartnerSection';
import { AdminSection } from '@/components/dashboard/AdminSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as ToasterUI } from '@/components/ui/toaster';

type Tab = 'profile' | 'roles' | 'master' | 'partner' | 'admin';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', full_name: '', phone: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadDashboard();
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      const data = await profileApi.getDashboard();
      setDashboard(data);
    } catch {
      authService.logout();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setDashboard(null);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setLoading(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await authService.login(loginForm.email, loginForm.password);
      toast({ title: 'Успешно!', description: 'Вы вошли в систему' });
      handleAuthSuccess();
    } catch (error) {
      toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось войти', variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await authService.register(registerForm.email, registerForm.password, registerForm.full_name, registerForm.phone);
      toast({ title: 'Успешно!', description: 'Регистрация завершена' });
      handleAuthSuccess();
    } catch (error) {
      toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось зарегистрироваться', variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };

  if (!isAuthenticated || !dashboard) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Icon name="Flame" className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">СПАРКОМ</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center px-4 py-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Icon name="Lock" className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground mb-8 max-w-md text-center">
            Войдите или зарегистрируйтесь, чтобы управлять профилем и получить доступ к кабинету
          </p>

          <div className="w-full max-w-sm">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="d-login-email">Email</Label>
                    <Input id="d-login-email" type="email" placeholder="your@email.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="d-login-password">Пароль</Label>
                    <Input id="d-login-password" type="password" placeholder="••••••" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? <><Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />Вход...</> : 'Войти'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="d-reg-name">Полное имя</Label>
                    <Input id="d-reg-name" type="text" placeholder="Иван Иванов" value={registerForm.full_name} onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="d-reg-email">Email</Label>
                    <Input id="d-reg-email" type="email" placeholder="your@email.com" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="d-reg-phone">Телефон (необязательно)</Label>
                    <Input id="d-reg-phone" type="tel" placeholder="+7 999 123-45-67" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="d-reg-password">Пароль</Label>
                    <Input id="d-reg-password" type="password" placeholder="••••••" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required minLength={6} />
                    <p className="text-xs text-muted-foreground">Минимум 6 символов</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? <><Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />Регистрация...</> : 'Зарегистрироваться'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <ToasterUI />
        <Toaster />
      </div>
    );
  }

  const { permissions } = dashboard;

  const tabs: { id: Tab; label: string; icon: string; show: boolean }[] = [
    { id: 'profile', label: 'Профиль', icon: 'User', show: true },
    { id: 'roles', label: 'Мои роли', icon: 'Shield', show: true },
    { id: 'master', label: 'Кабинет мастера', icon: 'Award', show: permissions.is_master },
    { id: 'partner', label: 'Кабинет партнёра', icon: 'Building2', show: permissions.is_partner },
    { id: 'admin', label: 'Администрирование', icon: 'Settings', show: permissions.is_admin },
  ];

  const visibleTabs = tabs.filter(t => t.show);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Icon name="Flame" className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">СПАРКОМ</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:inline">{dashboard.user.full_name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-1">
              <div className="p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{dashboard.user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{dashboard.user.email}</p>
                  </div>
                </div>
              </div>

              <Separator className="mb-2" />

              <nav className="space-y-1">
                {visibleTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab.icon} className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <Separator className="my-2" />

              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Icon name="Link" className="h-4 w-4" />
                Привязанные аккаунты
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <ProfileSection dashboard={dashboard} onUpdate={loadDashboard} />
            )}
            {activeTab === 'roles' && (
              <RolesSection dashboard={dashboard} onUpdate={loadDashboard} />
            )}
            {activeTab === 'master' && permissions.is_master && (
              <MasterSection />
            )}
            {activeTab === 'partner' && permissions.is_partner && (
              <PartnerSection />
            )}
            {activeTab === 'admin' && permissions.is_admin && (
              <AdminSection />
            )}
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  );
}