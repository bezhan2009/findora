
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useData } from "@/hooks/use-data";
import { BarChart, Eye, Heart, Users, LineChart as LineChartIcon, Activity, TrendingUp, Target, Star, MoreVertical, Percent } from "lucide-react";
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
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DollarSignIcon } from "lucide-react";

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
    const { services, users: allUsers } = useData();
    const router = useRouter();

    useEffect(() => {
        if (role !== 'provider') {
            router.push('/');
        }
    }, [role, router]);

    const { 
        providerServices, 
        totalRevenue, 
        totalLikes, 
        totalViews, 
        monthlyPerformanceData,
        topServicesData,
        recentActivity
    } = useMemo(() => {
        if (!user) return { providerServices: [], totalRevenue: 0, totalLikes: 0, totalViews: 0, monthlyPerformanceData: [], topServicesData: [], recentActivity: [] };

        const providerServices = services.filter(s => s.provider.username === user.username);
        
        let totalRevenue = 0;
        let totalLikes = 0;
        let totalViews = 0;
        
        providerServices.forEach(s => {
            totalRevenue += s.analytics?.revenue ?? 0;
            totalLikes += s.analytics?.likes ?? 0;
            totalViews += s.analytics?.views ?? 0;
        });

        const providerPosts = user.posts || [];
        const postLikes = providerPosts.reduce((acc, post) => acc + (post.likes || 0), 0);
        totalLikes += postLikes;

        // Mock monthly data based on total revenue
        const monthlyPerformanceData = [
            { name: 'Янв', views: Math.floor(totalViews * 0.1), revenue: Math.floor(totalRevenue * 0.05) },
            { name: 'Фев', views: Math.floor(totalViews * 0.12), revenue: Math.floor(totalRevenue * 0.1) },
            { name: 'Март', views: Math.floor(totalViews * 0.15), revenue: Math.floor(totalRevenue * 0.15) },
            { name: 'Апр', views: Math.floor(totalViews * 0.2), revenue: Math.floor(totalRevenue * 0.2) },
            { name: 'Май', views: Math.floor(totalViews * 0.18), revenue: Math.floor(totalRevenue * 0.15) },
            { name: 'Июнь', views: Math.floor(totalViews * 0.25), revenue: Math.floor(totalRevenue * 0.2) },
            { name: 'Июль', views: Math.floor(totalViews), revenue: Math.floor(totalRevenue) },
        ];

        const topServicesData = providerServices
            .sort((a, b) => (b.analytics?.revenue ?? 0) - (a.analytics?.revenue ?? 0))
            .slice(0, 5)
            .map(s => ({ name: s.title.substring(0, 15) + '...', revenue: s.analytics?.revenue ?? 0 }));

        const recentActivity = allUsers
            .flatMap(u => u.orders || [])
            .filter(order => providerServices.some(s => s.title === order.serviceTitle))
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map(order => {
                const customer = allUsers.find(u => u.orders?.some(o => o.id === order.id));
                return {
                    name: customer?.name || 'Клиент',
                    action: 'разместил(а) заказ.',
                    service: `На "${order.serviceTitle}".`,
                    time: `${Math.round((new Date().getTime() - new Date(order.date).getTime()) / (1000 * 60 * 60))} ч. назад`,
                    avatar: customer?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
                }
            });

        return { providerServices, totalRevenue, totalLikes, totalViews, monthlyPerformanceData, topServicesData, recentActivity };
    }, [user, services, allUsers]);

    if (role !== 'provider' || !user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Загрузка или перенаправление...</p>
            </div>
        );
    }

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
          { title: 'Общий доход', value: `${totalRevenue.toLocaleString()} TJS`, change: '+20.1%', icon: DollarSignIcon, color: 'text-emerald-500' },
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
                    {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
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
                    )) : <p className="text-sm text-muted-foreground text-center py-10">Нет недавней активности.</p>}
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
