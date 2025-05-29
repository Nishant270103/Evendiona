// src/components/SizeGuideModal.jsx
export default function SizeGuideModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-[#8A6552]">Size Guide</h2>
        <table className="w-full text-left mb-4">
          <thead>
            <tr>
              <th>Size</th><th>Chest (in)</th><th>Length (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>S</td><td>36-38</td><td>27</td></tr>
            <tr><td>M</td><td>39-41</td><td>28</td></tr>
            <tr><td>L</td><td>42-44</td><td>29</td></tr>
            <tr><td>XL</td><td>45-47</td><td>30</td></tr>
          </tbody>
        </table>
        <button onClick={onClose} className="mt-2 px-4 py-2 bg-[#8A6552] text-white rounded">Close</button>
      </div>
    </div>
  );
}
