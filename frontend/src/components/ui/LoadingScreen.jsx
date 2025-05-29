// src/components/ui/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <img 
          src="/images/logo.png" 
          alt="Evendiona" 
          className="h-24 mx-auto mb-4 animate-pulse" // Increased from h-16 to h-24
        />
        <p className="text-[#8A6552]">Loading...</p>
      </div>
    </div>
  );
}
