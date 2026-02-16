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

export function FavoritesSection() {
  const [activeTab, setActiveTab] = useState('banya');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Избранное</h1>
        <p className="text-muted-foreground mt-1">Сохранённые бани, мастера и статьи</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="banya">
            <Icon name="Flame" className="h-4 w-4 mr-2" />
            Бани
          </TabsTrigger>
          <TabsTrigger value="masters">
            <Icon name="Award" className="h-4 w-4 mr-2" />
            Мастера
          </TabsTrigger>
          <TabsTrigger value="articles">
            <Icon name="BookOpen" className="h-4 w-4 mr-2" />
            Статьи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banya">
          <Card>
            <CardHeader>
              <CardTitle>Сохранённые бани</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="Flame"
                title="Нет сохранённых бань"
                description="Добавляйте бани в избранное, чтобы быстро к ним возвращаться"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="masters">
          <Card>
            <CardHeader>
              <CardTitle>Сохранённые мастера</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="Award"
                title="Нет сохранённых мастеров"
                description="Сохраняйте понравившихся мастеров для быстрого доступа"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Сохранённые статьи</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="BookOpen"
                title="Нет сохранённых статей"
                description="Читайте и сохраняйте интересные статьи о банной культуре"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
