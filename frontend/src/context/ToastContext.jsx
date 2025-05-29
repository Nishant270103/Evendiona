import React, { createContext, useContext, useEffect, useState } from "react";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-xs ${
      type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
    }`}>
      {type === "success" ? (
        <span className="text-green-500">✓</span>
      ) : (
        <span className="text-red-500">✗</span>
      )}
      <p className="text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        ×
      </button>
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
