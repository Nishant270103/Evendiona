// src/pages/admin/AdminProducts.jsx

import { useEffect, useState, useRef } from "react";

// Cloudinary Upload Widget Button
function CloudinaryUploadButton({ onUpload }) {
  const widgetRef = useRef();
  useEffect(() => {
    if (window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "YOUR_CLOUD_NAME",        // <-- Change to your Cloudinary cloud name
          uploadPreset: "YOUR_UPLOAD_PRESET",  // <-- Change to your unsigned preset
          multiple: false,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            onUpload(result.info.secure_url); // This is the image URL
          }
        }
      );
    }
  }, [onUpload]);
  return (
    <button
      type="button"
      onClick={() => widgetRef.current && widgetRef.current.open()}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Upload Image
    </button>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        alert(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      alert('Network error while fetching products');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Add product handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Save image as array of objects for schema compatibility
      const productToSend = {
        ...newProduct,
        images: newProduct.image ? [{ url: newProduct.image }] : [],
      };
      delete productToSend.image;

      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productToSend)
      });
      const data = await response.json();

      if (data.success) {
        alert('Product created successfully!');
        setNewProduct({ name: '', description: '', category: '', price: '', stock: '', status: 'active', image: '' });
        setImagePreview(null);
        fetchProducts();
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (error) {
      alert('Network error while creating product');
    }
    setAdding(false);
  };

  // Start editing a product
  const handleEditStart = (prod) => {
    setEditId(prod._id);
    setEditProduct({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      status: prod.status,
      image: prod.images && prod.images[0]?.url ? prod.images[0].url : ''
    });
    setEditImagePreview(prod.images && prod.images[0]?.url ? prod.images[0].url : null);
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
    setEditProduct({});
    setEditImagePreview(null);
  };

  // Save edited product
  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const productToSend = {
        ...editProduct,
        images: editProduct.image ? [{ url: editProduct.image }] : [],
      };
      delete productToSend.image;

      const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productToSend)
      });
      const data = await response.json();
      if (data.success) {
        alert('Product updated successfully!');
        setEditId(null);
        setEditProduct({});
        setEditImagePreview(null);
        fetchProducts();
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      alert('Network error while updating product');
    }
  };

  // Delete product handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      alert('Network error while deleting product');
    }
    setDeleting(null);
  };

  // Handle image upload for add
  const handleCloudinaryUpload = (url) => {
    setNewProduct({ ...newProduct, image: url });
    setImagePreview(url);
  };

  // Handle image upload for edit
  const handleEditCloudinaryUpload = (url) => {
    setEditProduct({ ...editProduct, image: url });
    setEditImagePreview(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* --- Add Product Form --- */}
      <form onSubmit={handleAddProduct} className="mb-6 flex flex-wrap gap-4 items-end">
        <input
          type="text"
          required
          placeholder="Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          required
          placeholder="Description"
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <select
          value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="t-shirts">T-Shirts</option>
          <option value="casual">Casual</option>
          <option value="premium">Premium</option>
          <option value="limited">Limited</option>
        </select>
        <input
          type="number"
          required
          placeholder="Price"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          required
          placeholder="Stock"
          value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <select
          value={newProduct.status}
          onChange={e => setNewProduct({ ...newProduct, status: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <CloudinaryUploadButton onUpload={handleCloudinaryUpload} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
        )}
        <button
          type="submit"
          disabled={adding}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {adding ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      {/* --- Products Table --- */}
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id} className="border-b last:border-b-0">
                  {editId === prod._id ? (
                    <>
                      <td className="px-4 py-2">
                        {editImagePreview && (
                          <img src={editImagePreview} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        )}
                        <CloudinaryUploadButton onUpload={handleEditCloudinaryUpload} />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editProduct.name}
                          onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editProduct.description}
                          onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editProduct.category}
                          onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        >
                          <option value="">Select Category</option>
                          <option value="t-shirts">T-Shirts</option>
                          <option value="casual">Casual</option>
                          <option value="premium">Premium</option>
                          <option value="limited">Limited</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editProduct.price}
                          onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editProduct.stock}
                          onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editProduct.status}
                          onChange={e => setEditProduct({ ...editProduct, status: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEditSave(prod._id)}
                          className="text-green-600 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-gray-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">
                        {prod.images && prod.images.length > 0 && (
                          <img src={prod.images[0].url} alt={prod.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        )}
                      </td>
                      <td className="px-4 py-2">{prod.name}</td>
                      <td className="px-4 py-2">{prod.description}</td>
                      <td className="px-4 py-2">{prod.category}</td>
                      <td className="px-4 py-2">₹{prod.price}</td>
                      <td className="px-4 py-2">{prod.stock}</td>
                      <td className="px-4 py-2">{prod.status}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEditStart(prod)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="text-red-600 hover:underline"
                          disabled={deleting === prod._id}
                        >
                          {deleting === prod._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
