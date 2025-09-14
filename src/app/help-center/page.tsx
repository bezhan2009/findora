
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Help Center</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                To create an account, click on the &quot;Sign Up&quot; button in the top right corner of the homepage. You can sign up as either a customer or a service provider.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I book a service?</AccordionTrigger>
              <AccordionContent>
                Once you find a service you like, you can message the provider directly from the service page to discuss details and arrangements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I save services for later?</AccordionTrigger>
              <AccordionContent>
                Yes, you can click the heart icon on any service card to add it to your favorites. You can view your favorites list from your profile menu.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>How do I become a service provider?</AccordionTrigger>
              <AccordionContent>
                When signing up, choose the &quot;Offer a service&quot; role. Once your account is created, you can create a detailed profile and start listing your services from your provider dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What is your refund policy?</AccordionTrigger>
              <AccordionContent>
                Refund policies are typically set by the individual service providers. We recommend discussing payment and refund terms directly with the provider before purchasing a service. BizMart provides a platform for connection but does not handle direct payments or refunds.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

    