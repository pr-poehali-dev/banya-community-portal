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

export function FinancesSection() {
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Финансы</h1>
        <p className="text-muted-foreground mt-1">Транзакции, возвраты и платёжные данные</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">
            <Icon name="ArrowLeftRight" className="h-4 w-4 mr-2" />
            Транзакции
          </TabsTrigger>
          <TabsTrigger value="refunds">
            <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
            Возвраты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="Wallet"
                title="Нет транзакций"
                description="Здесь будет история ваших платежей"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>Возвраты</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon="RotateCcw"
                title="Нет возвратов"
                description="Информация о возвратах средств будет здесь"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
