import Link from 'next/link';
import Logo from './logo';
import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Ваш универсальный маркетплейс качественных услуг.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Главная</Link></li>
              <li><Link href="/favorites" className="text-sm text-muted-foreground hover:text-primary">Избранное</Link></li>
              <li><Link href="/chat" className="text-sm text-muted-foreground hover:text-primary">Сообщения</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li><Link href="/help-center" className="text-sm text-muted-foreground hover:text-primary">Центр помощи</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Условия использования</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Политика конфиденциальности</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Следите за нами</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BizMart. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
