// components/ui/OptimizedImage.jsx
import { useState } from 'react';

export default function OptimizedImage({ src, alt, className, fallback = '/images/placeholder.jpg' }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setImageSrc(fallback);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        loading="lazy"
      />
    </div>
  );
}
