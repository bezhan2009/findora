"use client";

import React from 'react';
import { Gift, Coins, TrendingUp, ShoppingBag, MessageSquare, UserPlus, CheckCircle2, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function BonusProgramPage() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="bg-primary/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center border border-primary/10">
        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-3xl">
              <Gift className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Findora Bonus</h1>
          <p className="text-muted-foreground text-xl">
            Копите баллы за каждую покупку и активность на платформе. Тратьте их на эксклюзивные услуги и скидки до 100%!
          </p>
          {!user && (
            <Button size="lg" className="rounded-full px-12 text-lg h-14" asChild>
              <Link href="/register">Присоединиться бесплатно</Link>
            </Button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
      </section>

      {/* User Dashboard Mockup */}
      {user && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 overflow-hidden border-2 border-primary/20 shadow-xl">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-headline">Твой статус: Silver</CardTitle>
                  <CardDescription className="text-primary-foreground/80">До Gold статуса осталось 450 баллов</CardDescription>
                </div>
                <Trophy className="h-12 w-12 opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Уровень Silver</span>
                  <span>1550 / 2000 баллов</span>
                </div>
                <Progress value={75} className="h-3 bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Баланс баллов', value: '1,550', icon: Coins },
                  { label: 'Кэшбэк', value: '5%', icon: TrendingUp },
                  { label: 'Скидка на услуги', value: '10%', icon: Sparkles },
                  { label: 'Друзей приглашено', value: '12', icon: UserPlus },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl border text-center">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 text-white p-8 flex flex-col justify-center border-none shadow-xl">
            <h3 className="text-2xl font-bold font-headline mb-4 text-primary">История транзакций</h3>
            <div className="space-y-4">
              {[
                { action: 'Покупка товара', pts: '+45' },
                { action: 'Отзыв с фото', pts: '+20' },
                { action: 'Приглашение друга', pts: '+100' },
                { action: 'Заказ услуги', pts: '+80' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
                  <span className="text-slate-400">{item.action}</span>
                  <span className="text-primary font-bold">{item.pts}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 border-white/20 hover:bg-white/10 text-white">Все операции</Button>
          </Card>
        </section>
      )}

      {/* How to Earn */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold font-headline text-center">Как заработать баллы?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Делайте покупки', 
              desc: 'За каждый потраченный 1 TJS вы получаете 1 балл. Начисляется автоматически после оплаты.',
              icon: ShoppingBag,
              pts: '1 TJS = 1 pt'
            },
            { 
              title: 'Оставляйте отзывы', 
              desc: 'Помогайте другим пользователям! За каждый честный отзыв с фото вы получаете бонусы.',
              icon: MessageSquare,
              pts: 'До 50 pts'
            },
            { 
              title: 'Зовите друзей', 
              desc: 'Отправьте ссылку другу. Мы начислим вам обоим баллы после его первой покупки.',
              icon: UserPlus,
              pts: '100 pts'
            }
          ].map((method, i) => (
            <div key={i} className="bg-card border-2 border-slate-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
              <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <method.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{method.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{method.desc}</p>
              <Badge variant="outline" className="text-primary border-primary/20 font-bold">{method.pts}</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Levels Table */}
      <section className="bg-slate-50 rounded-[3rem] p-8 md:p-12">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Привилегии по статусам</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-4 font-bold text-slate-400">ПРИВИЛЕГИЯ</th>
                <th className="py-4 font-bold text-slate-600">BRONZE</th>
                <th className="py-4 font-bold text-primary">SILVER</th>
                <th className="py-4 font-bold text-yellow-600">GOLD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { name: 'Кэшбэк баллами', bronze: '3%', silver: '5%', gold: '10%' },
                { name: 'Оплата баллами', bronze: 'до 30%', silver: 'до 50%', gold: 'до 100%' },
                { name: 'Спецпредложения', bronze: <CheckCircle2 className="h-5 w-5 text-green-500" />, silver: <CheckCircle2 className="h-5 w-5 text-green-500" />, gold: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
                { name: 'Персональный менеджер', bronze: '-', silver: '-', gold: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
                { name: 'Приоритетная поддержка', bronze: '-', silver: <CheckCircle2 className="h-5 w-5 text-green-500" />, gold: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 font-medium text-slate-700">{row.name}</td>
                  <td className="py-4 text-slate-500">{row.bronze}</td>
                  <td className="py-4 font-bold text-primary">{row.silver}</td>
                  <td className="py-4 font-bold text-yellow-600">{row.gold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Summary */}
      <section className="text-center max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold font-headline">Есть вопросы?</h2>
        <p className="text-muted-foreground">Наши специалисты поддержки готовы помочь вам разобраться в деталях бонусной программы 24/7.</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="rounded-full px-8" asChild>
            <Link href="/help-center">База знаний</Link>
          </Button>
          <Button variant="default" className="rounded-full px-8" asChild>
            <Link href="/chat">Чат с поддержкой</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
