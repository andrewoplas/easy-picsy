import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Terms of Service - Easy Picsy',
  description: 'Terms of Service for Easy Picsy photo booth management platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href={ROUTES.ADMIN.REGISTER}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-easy-black mb-2">Terms of Service</h1>
          <p className="text-sm sm:text-base text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Easy Picsy (&ldquo;the Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Easy Picsy is a photo booth management platform that provides tools for managing photo booth events, analytics, and customer interactions. The service includes but is not limited to:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              <li>Event management and scheduling</li>
              <li>Photo booth session tracking</li>
              <li>Analytics and reporting</li>
              <li>Customer data management</li>
              <li>Payment processing integration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">5. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices. We are committed to protecting your personal information and complying with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Easy Picsy and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">7. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              If you purchase a subscription or other paid features, you agree to pay all fees and charges associated with your account. All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">8. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Easy Picsy expressly disclaims all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall Easy Picsy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> hello@easypicsybooths.com<br />
                <strong>Address:</strong> Easy Picsy Legal Department<br />
                <strong>Phone:</strong> (+63) 9055625909
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
