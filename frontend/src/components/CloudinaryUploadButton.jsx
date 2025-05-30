import { useRef, useEffect } from "react";

/**
 * CloudinaryUploadButton
 * @param {function} onUpload - callback with the uploaded image URL
 */
export default function CloudinaryUploadButton({ onUpload }) {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!window.cloudinary) return;

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "duh82t7qj",         // Your Cloudinary cloud name
          uploadPreset: "Evendiona",      // Your unsigned preset (case-sensitive!)
          multiple: false,
          sources: ["local", "url", "camera"],
          cropping: false,
          folder: "products",             // Optional: uploads go to 'products' folder
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            onUpload(result.info.secure_url);
          }
        }
      );
    }
  }, [onUpload]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      alert("Cloudinary widget not loaded yet. Please refresh the page.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
    >
      Upload Image
    </button>
  );
}
