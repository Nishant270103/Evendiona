// src/pages/About.jsx - MODERN MINIMALIST ABOUT
export default function About() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-wide">
            About Evendiona
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            We believe in creating premium T-shirts that combine comfort, 
            style, and sustainability for the modern individual.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                Our Story
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                Founded in 2023, Evendiona started with a simple mission: 
                to create the perfect T-shirt that doesn't compromise on 
                comfort, quality, or style.
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                Every piece is carefully crafted with premium materials 
                and designed to be timeless, sustainable, and incredibly 
                comfortable for everyday wear.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
              <span className="text-6xl">🏭</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
              Our Values
            </h2>
            <p className="text-gray-600 font-light">
              What drives us every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-6">🌱</div>
              <h3 className="font-medium text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We use eco-friendly materials and sustainable manufacturing 
                processes to minimize our environmental impact.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-6">⭐</div>
              <h3 className="font-medium text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Every T-shirt is made with premium cotton and undergoes 
                rigorous quality checks to ensure lasting comfort.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-6">🎨</div>
              <h3 className="font-medium text-gray-900 mb-4">Design</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Our designs are timeless, versatile, and crafted to complement 
                your personal style effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
