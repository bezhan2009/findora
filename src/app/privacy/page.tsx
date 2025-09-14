
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Privacy Policy</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Commitment to Your Privacy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
            <p>This Privacy Policy describes how BizMart (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your personal information when you use our website and services.</p>
            
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide to us directly, such as when you create an account, list a service, or communicate with other users. This may include your name, email address, location, and any other information you choose to provide.</p>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide, maintain, and improve our services.</li>
                <li>Facilitate communication between users.</li>
                <li>Personalize your experience on our platform.</li>
                <li>Send you technical notices, updates, security alerts, and support messages.</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
            
            <h2>4. Your Choices</h2>
            <p>You may update, correct, or delete information about you at any time by logging into your online account or emailing us. If you wish to delete your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes.</p>

            <h2>5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@bizmart.com.</p>

            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}

    