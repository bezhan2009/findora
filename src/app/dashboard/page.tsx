"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useData } from "@/hooks/use-data";
import { BarChart, Eye, Heart, DollarSign, Users, LineChart as LineChartIcon, Activity } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const chartData = [
  { name: 'Янв', views: 4000, likes: 2400, revenue: 2400 },
  { name: 'Фев', views: 3000, likes: 1398, revenue: 2210 },
  { name: 'Март', views: 2000, likes: 9800, revenue: 2290 },
  { name: 'Апр', views: 2780, likes: 3908, revenue: 2000 },
  { name: 'Май', views: 1890, likes: 4800, revenue: 2181 },
  { name: 'Июнь', views: 2390, likes: 3800, revenue: 2500 },
  { name: 'Июль', views: 3490, likes: 4300, revenue: 2100 },
];

export default function DashboardPage() {
    const { user, role } = useAuth();
    const { services } = useData();
    const router = useRouter();

    useEffect(() => {
        if (role !== 'provider') {
            router.push('/');
        }
    }, [role, router]);

    if (role !== 'provider' || !user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Загрузка или перенаправление...</p>
            </div>
        );
    }

    const providerServices = services.filter(s => s.provider.username === user.username);
    const totalViews = providerServices.reduce((acc, s) => acc + (s.analytics?.views ?? 0), 0);
    const totalLikes = providerServices.reduce((acc, s) => acc + (s.analytics?.likes ?? 0), 0);
    const totalRevenue = providerServices.reduce((acc, s) => acc + (s.analytics?.revenue ?? 0), 0);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
            <BarChart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Панель управления</h1>
        </div>
        <div className="flex gap-2">
            <Button>+ Добавить новую услугу</Button>
            <Button variant="outline">+ Создать новый пост</Button>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+20.1% с прошлого месяца</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего просмотров</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+180.1% с прошлого месяца</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего лайков</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">+19% с прошлого месяца</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Новые подписчики</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">с прошлого месяца</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5"/>
                    Месячная производительность
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <RechartsLineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" name="Доход" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="views" name="Просмотры" stroke="hsl(var(--accent))" />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Activity className="h-5 w-5"/>
                    Последняя активность
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" data-ai-hint="person" />
                            <AvatarFallback>DP</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Диана Князева разместила заказ.</p>
                            <p className="text-sm text-muted-foreground">На "Разработка сайта на заказ".</p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">5 мин назад</div>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                           <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" data-ai-hint="person" />
                            <AvatarFallback>CC</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Клиент В оставил 5-звездочный отзыв.</p>
                            <p className="text-sm text-muted-foreground">На "Профессиональный дизайн логотипа".</p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">2 часа назад</div>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://images.unsplash.com/photo-1552058544-f2b08422138a" data-ai-hint="person" />
                            <AvatarFallback>CB</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Клиент Б оценил вашу услугу.</p>
                            <p className="text-sm text-muted-foreground">"Настройка E-commerce магазина".</p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">1 день назад</div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
