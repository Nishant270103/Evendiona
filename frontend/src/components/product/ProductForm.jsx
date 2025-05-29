import React, { useState } from 'react';

const ProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    image: null,
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('status', newProduct.status);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert('Product created successfully!');
        setNewProduct({ name: '', description: '', category: '', price: '', stock: '', status: 'active', image: null });
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stock"
        value={newProduct.stock}
        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
      />
      <select
        value={newProduct.status}
        onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
