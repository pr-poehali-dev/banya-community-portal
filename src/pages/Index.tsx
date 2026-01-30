import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');

  const masters = [
    {
      id: 1,
      name: 'Иван Березкин',
      specialty: 'Традиционное парение',
      experience: '15 лет',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: 'Мастер традиционных банных практик, специализируется на веничном массаже и травяных настоях.'
    },
    {
      id: 2,
      name: 'Мария Дубова',
      specialty: 'Оздоровительное парение',
      experience: '8 лет',
      rating: 5.0,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      description: 'Специалист по оздоровительным банным процедурам с использованием эфирных масел.'
    },
    {
      id: 3,
      name: 'Сергей Каменев',
      specialty: 'Спортивное парение',
      experience: '12 лет',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Инструктор по спортивному парению, работа с профессиональными спортсменами.'
    }
  ];

  const bathhouses = [
    {
      id: 1,
      name: 'Русская баня "Березка"',
      location: 'Москва, ул. Лесная 12',
      type: 'Традиционная русская баня',
      capacity: '8-12 человек',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=500&fit=crop',
      features: ['Дровяная печь', 'Купель с холодной водой', 'Комната отдыха', 'Веники в подарок']
    },
    {
      id: 2,
      name: 'Банный комплекс "Камелек"',
      location: 'Санкт-Петербург, пр. Каменный 45',
      type: 'Современный комплекс',
      capacity: '15-20 человек',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
      features: ['Финская сауна', 'Хаммам', 'Бассейн', 'Массажные комнаты']
    },
    {
      id: 3,
      name: 'Баня на дровах "Теремок"',
      location: 'Казань, ул. Дубовая 8',
      type: 'Аутентичная баня',
      capacity: '6-10 человек',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=500&fit=crop',
      features: ['Печь на дровах', 'Терраса', 'Чайная зона', 'Трансфер']
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Традиционное парение с Иваном',
      date: '15 февраля 2026',
      time: '18:00',
      location: 'Русская баня "Березка"',
      participants: '8/12',
      price: '2500 ₽',
      type: 'Традиция'
    },
    {
      id: 2,
      title: 'Оздоровительная банная программа',
      date: '18 февраля 2026',
      time: '16:00',
      location: 'Банный комплекс "Камелек"',
      participants: '12/20',
      price: '3000 ₽',
      type: 'Здоровье'
    },
    {
      id: 3,
      title: 'Мастер-класс по банным веникам',
      date: '22 февраля 2026',
      time: '14:00',
      location: 'Баня "Теремок"',
      participants: '5/10',
      price: '1500 ₽',
      type: 'Обучение'
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'История русской бани: от древности до наших дней',
      excerpt: 'Исследуем эволюцию банной культуры на Руси и её влияние на современные практики...',
      date: '25 января 2026',
      category: 'История',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Правильное использование веника: секреты мастеров',
      excerpt: 'Подробное руководство по выбору, запариванию и использованию различных видов веников...',
      date: '20 января 2026',
      category: 'Практика',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Польза бани для здоровья: научный подход',
      excerpt: 'Разбираем научные исследования о влиянии банных процедур на организм человека...',
      date: '12 января 2026',
      category: 'Здоровье',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 wood-texture">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icon name="Flame" className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">спарком.рф</span>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <Button variant="ghost" onClick={() => setActiveSection('main')}>
              Главная
            </Button>
            <Button variant="ghost" onClick={() => setActiveSection('events')}>
              События
            </Button>
            <Button variant="ghost" onClick={() => setActiveSection('masters')}>
              Мастера
            </Button>
            <Button variant="ghost" onClick={() => setActiveSection('baths')}>
              Бани
            </Button>
            <Button variant="ghost" onClick={() => setActiveSection('blog')}>
              Блог
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline">Войти</Button>
            <Button>Регистрация</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {activeSection === 'main' && (
        <>
          <section className="relative h-[600px] flex items-center justify-center overflow-hidden ethnic-pattern">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&h=1080&fit=crop)' }}
            ></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                Банное сообщество спарком.рф
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Возрождаем традиции русской бани, объединяем любителей и профессионалов банного дела
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" className="text-lg">
                  <Icon name="Calendar" className="mr-2" />
                  Посмотреть события
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  <Icon name="Users" className="mr-2" />
                  Найти мастера
                </Button>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 stone-texture">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">Наши ценности</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Мы создаем пространство для тех, кто ценит аутентичность, традиции и живое общение
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon name="Heart" className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Традиции</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Сохраняем и передаем знания о русской банной культуре следующим поколениям
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                      <Icon name="Users" className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle>Сообщество</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Объединяем единомышленников и создаем атмосферу доверия и взаимопомощи
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon name="Sparkles" className="h-8 w-8 text-secondary" />
                    </div>
                    <CardTitle>Качество</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Работаем только с профессионалами и проверенными банями-партнерами
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Upcoming Events Preview */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Ближайшие события</h2>
                  <p className="text-muted-foreground">Присоединяйтесь к нашим мероприятиям</p>
                </div>
                <Button variant="outline" onClick={() => setActiveSection('events')}>
                  Все события
                  <Icon name="ArrowRight" className="ml-2" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {events.slice(0, 3).map(event => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge>{event.type}</Badge>
                        <span className="text-sm text-muted-foreground">{event.participants}</span>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>{event.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-xl font-bold text-primary">{event.price}</span>
                          <Button>Записаться</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Events Section */}
      {activeSection === 'events' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">События</h1>
            <p className="text-xl text-muted-foreground mb-12">Календарь банных мероприятий сообщества</p>

            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">Все события</TabsTrigger>
                <TabsTrigger value="tradition">Традиция</TabsTrigger>
                <TabsTrigger value="health">Здоровье</TabsTrigger>
                <TabsTrigger value="education">Обучение</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{event.type}</Badge>
                      <span className="text-sm text-muted-foreground">{event.participants}</span>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-xl font-bold text-primary">{event.price}</span>
                        <Button>Записаться</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Masters Section */}
      {activeSection === 'masters' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Наши мастера</h1>
            <p className="text-xl text-muted-foreground mb-12">Профессионалы банного дела с многолетним опытом</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {masters.map(master => (
                <Card key={master.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={master.image} alt={master.name} />
                        <AvatarFallback>{master.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{master.name}</CardTitle>
                        <CardDescription className="mb-2">{master.specialty}</CardDescription>
                        <Badge variant="outline">{master.experience}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{master.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{master.rating}</span>
                        <span className="text-sm text-muted-foreground">({master.reviews})</span>
                      </div>
                      <Button>Записаться</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bathhouses Section */}
      {activeSection === 'baths' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Бани-партнеры</h1>
            <p className="text-xl text-muted-foreground mb-12">Проверенные локации для банных мероприятий</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bathhouses.map(bath => (
                <Card key={bath.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={bath.image} alt={bath.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{bath.name}</CardTitle>
                    <CardDescription>{bath.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Home" className="h-4 w-4 text-muted-foreground" />
                        <span>{bath.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
                        <span>{bath.capacity}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-semibold mb-2">Особенности:</p>
                        <div className="flex flex-wrap gap-2">
                          {bath.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-4">Подробнее</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {activeSection === 'blog' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Банная энциклопедия</h1>
            <p className="text-xl text-muted-foreground mb-12">Статьи, гайды и экспертные материалы о банной культуре</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-56 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge>{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">{post.excerpt}</CardDescription>
                    <Button variant="outline" className="w-full">
                      Читать далее
                      <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t wood-texture py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Flame" className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">спарком.рф</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Банное сообщество для ценителей традиций и здорового образа жизни
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <div className="space-y-2 text-sm">
                <div className="cursor-pointer hover:text-primary" onClick={() => setActiveSection('main')}>Главная</div>
                <div className="cursor-pointer hover:text-primary" onClick={() => setActiveSection('events')}>События</div>
                <div className="cursor-pointer hover:text-primary" onClick={() => setActiveSection('masters')}>Мастера</div>
                <div className="cursor-pointer hover:text-primary" onClick={() => setActiveSection('baths')}>Бани</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Сообщество</h3>
              <div className="space-y-2 text-sm">
                <div className="cursor-pointer hover:text-primary">О нас</div>
                <div className="cursor-pointer hover:text-primary">Правила</div>
                <div className="cursor-pointer hover:text-primary">FAQ</div>
                <div className="cursor-pointer hover:text-primary">Контакты</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Связь</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" className="h-4 w-4" />
                  <span>info@спарком.рф</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" className="h-4 w-4" />
                  <span>+7 (800) 123-45-67</span>
                </div>
                <div className="flex gap-4 mt-4">
                  <Icon name="MessageCircle" className="h-5 w-5 cursor-pointer hover:text-primary" />
                  <Icon name="Share2" className="h-5 w-5 cursor-pointer hover:text-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 спарком.рф. Все права защищены. Банное сообщество для ценителей традиций.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
