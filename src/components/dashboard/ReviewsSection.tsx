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

export function ReviewsSection() {
  const [activeTab, setActiveTab] = useState('my');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Отзывы</h1>
        <p className="text-muted-foreground mt-1">Ваши отзывы и ответы на них</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my">
            <Icon name="MessageSquare" className="h-4 w-4 mr-2" />
            Мои отзывы
          </TabsTrigger>
          <TabsTrigger value="responses">
            <Icon name="Reply" className="h-4 w-4 mr-2" />
            Ответы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          <Card>
            <CardHeader>
              <CardTitle>Оставленные отзывы</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="MessageSquare"
                title="Вы ещё не оставляли отзывов"
                description="После посещения бани вы сможете оставить отзыв"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Ответы на ваши отзывы</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="Reply"
                title="Нет ответов"
                description="Здесь появятся ответы мастеров и партнёров на ваши отзывы"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
