import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Центр помощи</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Часто задаваемые вопросы</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Как создать аккаунт?</AccordionTrigger>
              <AccordionContent>
                Чтобы создать аккаунт, нажмите на кнопку "Регистрация" в правом верхнем углу главной страницы. Вы можете зарегистрироваться как клиент или как исполнитель услуг.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Как заказать услугу?</AccordionTrigger>
              <AccordionContent>
                Найдя понравившуюся услугу, вы можете написать исполнителю напрямую со страницы услуги, чтобы обсудить детали и договориться об условиях.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Могу ли я сохранить услуги на потом?</AccordionTrigger>
              <AccordionContent>
                Да, вы можете нажать на значок сердца на любой карточке услуги, чтобы добавить ее в избранное. Вы можете просмотреть свой список избранного из меню вашего профиля.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Как стать исполнителем услуг?</AccordionTrigger>
              <AccordionContent>
                При регистрации выберите роль "Предложить услугу". После создания аккаунта вы сможете создать подробный профиль и начать размещать свои услуги из вашей панели управления исполнителя.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Какова ваша политика возврата средств?</AccordionTrigger>
              <AccordionContent>
                Политика возврата средств обычно устанавливается индивидуальными исполнителями. Мы рекомендуем обсуждать условия оплаты и возврата напрямую с исполнителем перед покупкой услуги. BizMart предоставляет платформу для связи, но не обрабатывает прямые платежи или возвраты.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
