import React, { useState, useEffect } from 'react';

export default function SimpleSlideshow() {
  const images = ['/images/tshirt1.jpg', '/images/tshirt2.jpg'];
  const [current, setCurrent] = useState(0);

  // Advance slide every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(i => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Slide ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-light mb-4 text-white drop-shadow-lg">
          Effortless Style
        </h1>
        <p className="text-xl mb-8 text-white drop-shadow">
          Premium quality t-shirts designed for comfort and versatility
        </p>
        <a
          href="/catalog"
          className="pointer-events-auto inline-block bg-[#8A6552] text-white px-8 py-3 rounded hover:bg-[#7A5542] transition"
        >
          Explore Collection
        </a>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === current ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
