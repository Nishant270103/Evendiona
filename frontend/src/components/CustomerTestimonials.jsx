// src/components/CustomerTestimonials.jsx
import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Amazing quality! The fabric is so soft and the fit is perfect. I've ordered 3 more!",
    image: "/images/customer1.jpg",
    product: "Classic White T-Shirt",
    verified: true
  },
  {
    id: 2,
    name: "Rahul Kumar",
    rating: 5,
    comment: "Best t-shirts I've ever bought. Great quality and fast delivery. Highly recommended!",
    image: "/images/customer2.jpg",
    product: "Black Graphic T-Shirt",
    verified: true
  },
  {
    id: 3,
    name: "Sneha Patel",
    rating: 4,
    comment: "Love the design and comfort. Perfect for daily wear. Will definitely buy again.",
    image: "/images/customer3.jpg",
    product: "Navy Blue T-Shirt",
    verified: true
  }
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#F9F7F5] to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#8A6552] mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Real reviews from real customers</p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <button
              onClick={prevTestimonial}
              className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
            </button>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 mx-8">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                      {testimonials[currentIndex].verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified Buyer
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonials[currentIndex].rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        for {testimonials[currentIndex].product}
                      </span>
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-lg text-gray-700 italic text-center">
                  "{testimonials[currentIndex].comment}"
                </blockquote>
              </div>
            </div>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#8A6552]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
