
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Terms of Service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agreement to our Legal Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
            <p>Welcome to BizMart! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the BizMart website and services (&quot;Platform&quot;).</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By using our Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Platform.</p>
            
            <h2>2. User Accounts</h2>
            <p>You must create an account to access certain features of the Platform. You are responsible for safeguarding your account and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>

            <h2>3. User Conduct</h2>
            <p>You agree not to use the Platform to:</p>
            <ul>
                <li>Post any content that is illegal, harmful, threatening, or otherwise objectionable.</li>
                <li>Engage in any activity that interferes with or disrupts the Platform.</li>
                <li>Impersonate any person or entity.</li>
            </ul>

            <h2>4. Services and Transactions</h2>
            <p>BizMart is a platform that connects service providers with customers. We are not a party to any agreement between users. We are not responsible for the performance of services, and we make no warranties about the quality, safety, or legality of the services provided.</p>
            
            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2>6. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.</p>
            
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}

    