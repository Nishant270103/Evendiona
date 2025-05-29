// src/components/NewsletterSignup.jsx
import React, { useState } from 'react';
import { EnvelopeIcon, GiftIcon } from '@heroicons/react/24/outline';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // API call to subscribe
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-[#8A6552]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-8">
            <GiftIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Family!</h3>
            <p className="text-gray-600 mb-4">
              Check your email for your exclusive 10% discount code.
            </p>
            <button
              onClick={() => setIsSubscribed(false)}
              className="text-[#8A6552] hover:underline"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#8A6552]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl p-8">
          <EnvelopeIcon className="h-16 w-16 text-[#8A6552] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get 10% Off Your First Order
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and be the first to know about new arrivals, 
            exclusive offers, and style tips.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#8A6552] focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#8A6552] text-white rounded-r-lg hover:bg-[#7A5542] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </section>
  );
}
