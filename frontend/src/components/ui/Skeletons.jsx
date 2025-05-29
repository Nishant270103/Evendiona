// src/components/ui/Skeletons.jsx
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-lg"></div>
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="bg-gray-200 aspect-square rounded-lg"></div>
      <div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-full mt-8"></div>
      </div>
    </div>
  );
}

export { ProductCardSkeleton, ProductDetailSkeleton };
