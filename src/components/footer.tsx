
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Github, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b pb-8 mb-8">
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">О нас</Link>
            <Link href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Доставка</Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Оплата</Link>
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Возврат</Link>
            <Link href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Контакты</Link>
          </nav>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground font-medium hidden sm:inline">Мы в соцсетях:</span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Findora Intelligence. Все права защищены.</p>
          <div className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <CreditCard className="h-5 w-5" />
            <span className="font-mono text-[10px] tracking-widest uppercase">Visa • MasterCard • Корти Милли</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
