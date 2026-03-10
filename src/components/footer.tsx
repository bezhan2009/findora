import Link from 'next/link';
import Logo from './logo';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Findora — ваш универсальный проводник в мире качественных товаров и услуг. Мы используем AI, чтобы сделать поиск идеального исполнителя проще и быстрее.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-bold mb-6 text-lg">Платформа</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Главная</Link></li>
              <li><Link href="/favorites" className="text-sm text-muted-foreground hover:text-primary transition-colors">Избранное</Link></li>
              <li><Link href="/ai-chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Ассистент</Link></li>
              <li><Link href="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">Сообщения</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-bold mb-6 text-lg">Поддержка</h3>
            <ul className="space-y-3">
              <li><Link href="/help-center" className="text-sm text-muted-foreground hover:text-primary transition-colors">Центр помощи</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Условия использования</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Конфиденциальность</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-bold mb-6 text-lg">Сообщество</h3>
            <div className="flex items-center gap-5">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Findora Intelligence. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}