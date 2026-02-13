import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuthModal } from '@/components/AuthModal';
import { authService, User } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

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
    window.location.href = '/dashboard';
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
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard'}>
                <Icon name="User" className="mr-2 h-4 w-4" />
                Кабинет
              </Button>
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

        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
              <div className="text-center space-y-6 mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                  Форматы встреч
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Четыре разных формата. Каждый — со своей атмосферой и задачей.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className="border-2 hover:border-primary/40 transition-colors cursor-pointer" 
                  onClick={() => setSelectedFormat('men')}
                >
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Мужской Пар</h3>
                    <p className="text-muted-foreground">
                      День, когда мужчины собираются вместе. Без масок и позы. Суровый пар, откровенные разговоры, внутренний стержень.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Подробнее <Icon name="ChevronRight" className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="border-2 hover:border-primary/40 transition-colors cursor-pointer" 
                  onClick={() => setSelectedFormat('joint')}
                >
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Совместное Событие</h3>
                    <p className="text-muted-foreground">
                      Главная встреча месяца. Мужчины, женщины, пары, друзья. Знакомства, общение, живой пар. Место, где чувствуешь дух сообщества.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Подробнее <Icon name="ChevronRight" className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="border-2 hover:border-primary/40 transition-colors cursor-pointer" 
                  onClick={() => setSelectedFormat('women')}
                >
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Женский Детокс</h3>
                    <p className="text-muted-foreground">
                      Пространство для женщин. Тёплые разговоры, детокс-практики, восстановление. То, чего не хватает в суете будней.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Подробнее <Icon name="ChevronRight" className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="border-2 hover:border-primary/40 transition-colors cursor-pointer" 
                  onClick={() => setSelectedFormat('intensive')}
                >
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Интенсив с пармастером</h3>
                    <p className="text-muted-foreground">
                      Для тех, кто хочет по-настоящему. Глубокое парение, банная культура, авторские техники. Опыт, который запоминается.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Подробнее <Icon name="ChevronRight" className="ml-1 h-4 w-4" />
                    </Button>
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

      <Dialog open={selectedFormat !== null} onOpenChange={() => setSelectedFormat(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedFormat === 'men' && 'Мужской Пар'}
              {selectedFormat === 'joint' && 'Совместное Событие'}
              {selectedFormat === 'women' && 'Женский Детокс'}
              {selectedFormat === 'intensive' && 'Интенсив с пармастером'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFormat === 'men' && (
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                Сила. Честность. Равные рядом.
              </p>
              <p>
                Этот день — про внутренний стержень. Про то, чтобы снять напряжение, поговорить без масок, вспомнить, что такое настоящая мужская поддержка.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Что внутри:</p>
                <ul className="space-y-2">
                  <li>— Суровый пар — выдохнуть всё лишнее</li>
                  <li>— Мужской круг — без позы и пафоса</li>
                  <li>— Разговоры, после которых становится легче</li>
                  <li>— Состояние ясности и собранности</li>
                </ul>
              </div>
              <p className="font-medium text-foreground pt-2">
                Мужчины уходят отсюда другими — чище, спокойнее, сильнее.
              </p>
            </div>
          )}

          {selectedFormat === 'joint' && (
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                Главная встреча месяца. Лёгкая. Живая. Атмосферная.
              </p>
              <p>
                Это день, когда мы собираемся все вместе — мужчины, женщины, пары, друзья. Знакомимся, общаемся, смеёмся, паримся, отдыхаем.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Что внутри:</p>
                <ul className="space-y-2">
                  <li>— Мягкая атмосфера</li>
                  <li>— Новые знакомства — естественные, без неловкости</li>
                  <li>— Красивая программа</li>
                  <li>— Живой пар и чувство праздника</li>
                </ul>
              </div>
              <p className="font-medium text-foreground pt-2">
                Если хотите почувствовать дух сообщества — приходите именно сюда.
              </p>
            </div>
          )}

          {selectedFormat === 'women' && (
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                Нежность. Тепло. Перезагрузка.
              </p>
              <p>
                Это пространство, созданное для женщин. Тёплые разговоры, мягкие практики, забота, восстановление — то, чего так не хватает в суете недели.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Что внутри:</p>
                <ul className="space-y-2">
                  <li>— Женские круги и тихие разговоры</li>
                  <li>— Детокс-ритуалы и лёгкие практики</li>
                  <li>— Чувство ясности и спокойствия</li>
                  <li>— Энергия, которая возвращает к себе</li>
                </ul>
              </div>
              <p className="font-medium text-foreground pt-2">
                Выходишь лёгкой, сияющей и глубоко выдохнувшей.
              </p>
            </div>
          )}

          {selectedFormat === 'intensive' && (
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                Глубина. Знание. Новые ощущения.
              </p>
              <p>
                Это день для тех, кто хочет «по-настоящему». Здесь изучают банную культуру, пробуют авторские техники и получают опыт, который долго помнят.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Что внутри:</p>
                <ul className="space-y-2">
                  <li>— Глубокое коллективное парение</li>
                  <li>— Обучение и разбор техники</li>
                  <li>— Мощный практический опыт</li>
                  <li>— Новое понимание своего тела</li>
                </ul>
              </div>
              <p className="font-medium text-foreground pt-2">
                Интенсив, после которого пар откроется с другой стороны.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default Index;