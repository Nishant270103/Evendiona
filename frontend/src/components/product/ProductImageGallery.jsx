// src/components/product/ProductImageGallery.jsx
import { useState } from "react";

function ProductImageGallery({ images = [] }) {
  const [mainImage, setMainImage] = useState(images[0] || "");
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // If no images provided, use a placeholder
  const allImages = images.length > 0 ? images : ["/placeholder-image.jpg"];

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main image with zoom effect */}
      <div 
        className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={mainImage || allImages[0]}
          alt="Product"
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                }
              : {}
          }
        />
      </div>
      
      {/* Thumbnail images */}
      <div className="grid grid-cols-4 gap-2">
        {allImages.map((img, index) => (
          <button
            key={index}
            className={`border rounded-md overflow-hidden ${
              img === mainImage ? 'border-black' : 'border-gray-200'
            }`}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Product view ${index + 1}`}
              className="w-full h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductImageGallery;
