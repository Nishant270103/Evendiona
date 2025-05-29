// src/pages/Contact.jsx - MODERN MINIMALIST CONTACT
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-wide">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 font-light">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-wide">
                Send Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors font-light"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors font-light"
                    required
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors font-light resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 font-medium hover:bg-gray-800 transition-colors rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-wide">
                Contact Info
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 font-light">hello@evendiona.com</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600 font-light">+91 98765 43210</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    123 Fashion Street<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <span className="text-2xl">📘</span>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <span className="text-2xl">📷</span>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <span className="text-2xl">🐦</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
