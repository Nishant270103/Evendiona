// src/components/product/SizeGuideModal.jsx
import { XMarkIcon } from "@heroicons/react/24/outline";

function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Size Guide</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Chest (in)</th>
                  <th className="px-4 py-2 text-left">Length (in)</th>
                  <th className="px-4 py-2 text-left">Sleeve (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">S</td>
                  <td className="px-4 py-2">36-38</td>
                  <td className="px-4 py-2">27</td>
                  <td className="px-4 py-2">8</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">M</td>
                  <td className="px-4 py-2">39-41</td>
                  <td className="px-4 py-2">28</td>
                  <td className="px-4 py-2">8.5</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">L</td>
                  <td className="px-4 py-2">42-44</td>
                  <td className="px-4 py-2">29</td>
                  <td className="px-4 py-2">9</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">XL</td>
                  <td className="px-4 py-2">45-47</td>
                  <td className="px-4 py-2">30</td>
                  <td className="px-4 py-2">9.5</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Measurements may vary by ±0.5 inches</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeGuideModal;
