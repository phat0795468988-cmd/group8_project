import React, { useState } from 'react';
import axios from 'axios';

export default function EditUserForm({ user, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
  });
  const [saving, setSaving] = useState(false);

  // Khi người dùng nhập dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Khi bấm "Lưu"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Gửi PUT request lên backend
      const res = await axios.put(`http://localhost:3000/users/${user.id}`, form);

      // Gọi callback để cập nhật danh sách bên UserList.jsx
      onSaved(res.data);

      alert('✅ Cập nhật thành công!');
    } catch (err) {
      console.error('❌ Cập nhật thất bại:', err);
      alert('Cập nhật thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-form" style={{ marginTop: 20 }}>
      <h3>Sửa người dùng</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
      </form>
    </div>
  );
}