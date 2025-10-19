"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useData } from "@/hooks/use-data";
import { BarChart, Eye, Heart, DollarSign, Users, LineChart as LineChartIcon, Activity, TrendingUp, Target, Star, MoreVertical, Percent } from "lucide-react";
import { 
    Bar, 
    BarChart as RechartsBarChart, 
    Area,
    AreaChart as RechartsAreaChart,
    ResponsiveContainer, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend, 
    CartesianGrid,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart
} from 'recharts';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const monthlyPerformanceData = [
  { name: 'Янв', views: 4000, revenue: 2400 },
  { name: 'Фев', views: 3000, revenue: 2210 },
  { name: 'Март', views: 2000, revenue: 2290 },
  { name: 'Апр', views: 2780, revenue: 2000 },
  { name: 'Май', views: 1890, revenue: 2181 },
  { name: 'Июнь', views: 2390, revenue: 2500 },
  { name: 'Июль', views: 3490, revenue: 2100 },
];

const categoryPerformanceData = [
  { subject: 'Веб-разработка', A: 120, fullMark: 150 },
  { subject: 'Граф. дизайн', A: 98, fullMark: 150 },
  { subject: 'Копирайтинг', A: 86, fullMark: 150 },
  { subject: 'Маркетинг', A: 99, fullMark: 150 },
  { subject: 'Видео', A: 85, fullMark: 150 },
];

const satisfactionData = [
  { name: '5 звезд', value: 85, fill: 'hsl(var(--primary))' },
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

    const topServicesData = providerServices
        .slice(0, 5)
        .map(s => ({ name: s.title.substring(0, 15) + '...', revenue: s.analytics?.revenue ?? 0 }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
            <BarChart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Панель управления</h1>
        </div>
        <div className="flex gap-2">
            <Button asChild><Link href="/dashboard/service/edit">+ Добавить новую услугу</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/post/edit">+ Создать новый пост</Link></Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { title: 'Общий доход', value: `$${totalRevenue.toLocaleString()}`, change: '+20.1%', icon: DollarSign, color: 'text-emerald-500' },
          { title: 'Всего просмотров', value: totalViews.toLocaleString(), change: '+180.1%', icon: Eye, color: 'text-blue-500' },
          { title: 'Всего лайков', value: totalLikes.toLocaleString(), change: '+19%', icon: Heart, color: 'text-rose-500' },
          { title: 'Новые подписчики', value: '+235', change: 'с прошлого месяца', icon: Users, color: 'text-indigo-500' }
        ].map((item, index) => (
          <Card key={index} className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className={cn("h-4 w-4 text-muted-foreground", item.color)} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
         <Card className="xl:col-span-2 glass">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5"/>
                    Месячная производительность
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsAreaChart data={monthlyPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                             <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card-glass) / 0.8)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid hsl(var(--border) / 0.2)',
                                color: 'hsl(var(--foreground))',
                                borderRadius: 'var(--radius)'
                            }}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Area type="monotone" dataKey="revenue" name="Доход" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="views" name="Просмотры" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorViews)" />
                    </RechartsAreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        <Card className="glass">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Activity className="h-5 w-5"/>
                    Последняя активность
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[
                      { name: 'Диана Князева', action: 'разместила заказ.', service: 'На "Разработка сайта на заказ".', time: '5 мин назад', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
                      { name: 'Клиент В', action: 'оставил 5-звездочный отзыв.', service: 'На "Профессиональный дизайн логотипа".', time: '2 часа назад', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
                      { name: 'Клиент Б', action: 'оценил вашу услугу.', service: '"Настройка E-commerce магазина".', time: '1 день назад', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center">
                          <Avatar className="h-9 w-9">
                              <AvatarImage src={activity.avatar} data-ai-hint="person" />
                              <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">{activity.name} {activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.service}</p>
                          </div>
                          <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass">
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Самые популярные услуги
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                      <RechartsBarChart data={topServicesData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                          <Tooltip cursor={{ fill: 'hsl(var(--primary)/0.1)' }} contentStyle={{ backgroundColor: 'hsl(var(--card-glass) / 0.8)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border) / 0.2)' }}/>
                          <Bar dataKey="revenue" name="Доход" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </RechartsBarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
           <Card className="glass">
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Эффективность по категориям
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryPerformanceData}>
                          <PolarGrid stroke="hsl(var(--border)/0.5)"/>
                          <PolarAngleAxis dataKey="subject" fontSize={12} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]}/>
                          <Radar name="Производительность" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6}/>
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card-glass) / 0.8)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border) / 0.2)' }}/>
                      </RadarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
           <Card className="glass">
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Удовлетворенность клиентов
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" barSize={20} data={satisfactionData} startAngle={90} endAngle={-270}>
                          <RadialBar
                              minAngle={15}
                              background
                              clockWise
                              dataKey="value"
                           />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card-glass) / 0.8)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border) / 0.2)' }}/>
                           <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-foreground text-3xl font-bold"
                            >
                              {satisfactionData[0].value}%
                            </text>
                             <text
                              x="50%"
                              y="65%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-muted-foreground text-sm"
                            >
                              Довольны
                            </text>
                      </RadialBarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
