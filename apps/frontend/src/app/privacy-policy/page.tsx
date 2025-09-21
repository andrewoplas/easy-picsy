import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Privacy Policy - Easy Picsy',
  description: 'Privacy Policy for Easy Picsy photo booth management platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/admin/register">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-easy-black mb-2">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            <h3 className="text-base sm:text-lg font-medium text-easy-black mb-2">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Account credentials and profile information</li>
              <li>Payment and billing information</li>
              <li>Communications with us</li>
            </ul>
            <h3 className="text-base sm:text-lg font-medium text-easy-black mb-2">Usage Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Device information and IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our service</li>
              <li>Photo booth session data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent security incidents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our service</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger or acquisition</li>
              <li><strong>Consent:</strong> We may share information with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to collect and use personal information about you. You can control cookies through your browser settings, but disabling cookies may affect the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-easy-black mb-3 sm:mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> hello@easypicsybooths.com<br />
                <strong>Address:</strong> Easy Picsy Privacy Team<br />
                <strong>Phone:</strong> (+63) 9055625909
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
