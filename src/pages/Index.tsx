import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuthModal } from '@/components/AuthModal';
import { authService, User } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await authService.verify();
      if (result?.valid) {
        setUser(result.user);
      }
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Icon name="Flame" className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">СПАРКОМ</span>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden md:inline">{user.full_name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
              Войти
            </Button>
          )}
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                В баню можно идти одному
              </h1>
              <div className="space-y-4 text-lg md:text-xl text-muted-foreground">
                <p>Если хочется нормальной бани, но не с кем — это не проблема.</p>
                <p>СПАРКОМ существует именно для таких ситуаций.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center">
                СПАРКОМ — это организованные банные встречи
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground text-center">
                <p>Мы собираем небольшие группы людей, которым важно спокойствие, уважение и порядок.</p>
                <p>Есть правила, есть организатор, нет алкоголя и случайных компаний.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-16">
                Этот формат подойдёт не всем — и в этом его смысл
              </h2>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Check" className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Подходит, если вы:</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">—</span>
                        <span>хотите пойти в баню, даже если идёте один</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">—</span>
                        <span>цените спокойный, трезвый формат</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">—</span>
                        <span>уважаете личные границы и общее пространство</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary mt-1">—</span>
                        <span>готовы следовать простым правилам</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-muted hover:border-muted-foreground/30 transition-colors">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Icon name="X" className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Не подойдёт, если вы:</h3>
                    </div>
                    <ul className="space-y-4 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-muted-foreground mt-1">—</span>
                        <span>ищете тусовку или спонтанность</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-muted-foreground mt-1">—</span>
                        <span>хотите «как пойдёт» и без рамок</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-muted-foreground mt-1">—</span>
                        <span>планируете алкоголь</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-muted-foreground mt-1">—</span>
                        <span>не готовы быть частью группы</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  Если этот формат откликнулся — переходите дальше
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg" onClick={() => !user && setShowAuthModal(true)}>
                  Посмотреть ближайшие встречи
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Написать организатору
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="Flame" className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">СПАРКОМ</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Telegram</a>
              <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              <a href="#" className="hover:text-foreground transition-colors">Правила</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
      />
      <Toaster />
    </div>
  );
};

export default Index;