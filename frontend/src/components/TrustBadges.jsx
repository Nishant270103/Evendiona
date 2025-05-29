// src/components/TrustBadges.jsx
export default function TrustBadges() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">OUR GUARANTEE</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="font-medium mb-2">Quality First</h3>
            <p className="text-gray-600">Our motto is "standard without compromise"</p>
          </div>
          <div className="text-center">
            <h3 className="font-medium mb-2">Seamless Experience</h3>
            <p className="text-gray-600">Place your order and leave the rest to us</p>
          </div>
          <div className="text-center">
            <h3 className="font-medium mb-2">Customer-First Approach</h3>
            <p className="text-gray-600">Committed to exceeding your expectations</p>
          </div>
        </div>
      </div>
    </section>
  );
}
