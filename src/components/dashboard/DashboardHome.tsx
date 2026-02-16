import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { DashboardData } from '@/lib/profile-api';

interface Props {
  dashboard: DashboardData;
  onNavigate: (tab: string) => void;
}

export function DashboardHome({ dashboard, onNavigate }: Props) {
  const stats = [
    { label: 'Мои события', value: '0', icon: 'Calendar', tab: 'events' },
    { label: 'Избранное', value: '0', icon: 'Heart', tab: 'favorites' },
    { label: 'Отзывы', value: '0', icon: 'MessageSquare', tab: 'reviews' },
    { label: 'Уведомления', value: '0', icon: 'Bell', tab: 'notifications' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Добро пожаловать, {dashboard.user.full_name?.split(' ')[0] || 'Участник'}!
        </h1>
        <p className="text-muted-foreground mt-1">Обзор вашего аккаунта</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.tab}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate(stat.tab)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name={stat.icon} className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Calendar" className="h-5 w-5 text-primary" />
            Ближайшие события
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="CalendarX" className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">У вас пока нет запланированных событий</p>
            <p className="text-sm text-muted-foreground mt-1">Забронируйте первое посещение бани на главной странице</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Heart" className="h-5 w-5 text-primary" />
            Избранное
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="HeartOff" className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Вы ещё ничего не добавили в избранное</p>
            <p className="text-sm text-muted-foreground mt-1">Сохраняйте понравившиеся бани, мастеров и статьи</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
