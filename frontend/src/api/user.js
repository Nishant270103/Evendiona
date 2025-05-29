// src/api/user.js
export async function getProfile(token) {
  const res = await fetch('/api/user/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function updateProfile(data, token) {
  const res = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function changePassword(data, token) {
  const res = await fetch('/api/user/profile/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Address book APIs (add, edit, delete)
export async function addAddress(data, token) {
  const res = await fetch('/api/user/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function editAddress(addressId, data, token) {
  const res = await fetch(`/api/user/addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function deleteAddress(addressId, token) {
  const res = await fetch(`/api/user/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
