// src/pages/PrivacyPolicy.jsx - SEPARATE FILE
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-light text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@evendiona.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
