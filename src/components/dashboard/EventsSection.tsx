import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon name={icon} className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

export function EventsSection() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Мои события</h1>
        <p className="text-muted-foreground mt-1">Бронирования, прошедшие посещения и квитанции</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            <Icon name="Calendar" className="h-4 w-4 mr-2" />
            Активные
          </TabsTrigger>
          <TabsTrigger value="archive">
            <Icon name="Archive" className="h-4 w-4 mr-2" />
            Архив
          </TabsTrigger>
          <TabsTrigger value="receipts">
            <Icon name="Receipt" className="h-4 w-4 mr-2" />
            Квитанции
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Активные бронирования</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="CalendarCheck"
                title="Нет активных бронирований"
                description="Когда вы забронируете посещение, оно появится здесь"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Прошедшие события</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="Clock"
                title="Архив пуст"
                description="Здесь будет история ваших посещений"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts">
          <Card>
            <CardHeader>
              <CardTitle>Квитанции об оплате</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="FileText"
                title="Нет квитанций"
                description="Квитанции за оплаченные услуги будут здесь"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
