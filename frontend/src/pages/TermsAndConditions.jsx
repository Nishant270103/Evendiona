// src/pages/TermsAndConditions.jsx - ONLY THIS COMPONENT
export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-light text-gray-900 mb-8">Terms and Conditions</h1>
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Evendiona, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Product Information</h2>
              <p>We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Orders and Payment</h2>
              <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Shipping and Returns</h2>
              <p>We offer a 7-day return policy for unused items in original condition. Shipping costs may apply.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
              <p>For questions about these Terms and Conditions, please contact us at support@evendiona.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
