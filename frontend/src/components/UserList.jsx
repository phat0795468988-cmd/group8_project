import React, { useState } from "react";
import axios from "axios";
import { useUsersState } from "../context/UsersProvider";

export default function UserList() {
  const { users, setUsers, loading, error } = useUsersState();
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ Xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa user này không?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
        alert("✅ Xóa thành công!");
      } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi xóa user!");
      }
    }
  };

  // ✅ Bấm nút sửa → mở form
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  // ✅ Cập nhật user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3000/users/${editingUser._id}`,
        formData
      );
      setUsers(
        users.map((u) => (u._id === editingUser._id ? res.data : u))
      );
      setEditingUser(null);
      alert("✅ Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật user!");
    }
  };

  if (loading) return <p>⏳ Đang tải...</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  return (
    <div>
      <h2>Danh sách Users</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)}>✏ Sửa</button>
                <button onClick={() => handleDelete(u._id)}>🗑 Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
          <h3>Chỉnh sửa User</h3>
          <input
            type="text"
            value={formData.name}
            placeholder="Tên"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            value={formData.email}
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit">Lưu lại</button>
          <button type="button" onClick={() => setEditingUser(null)}>Hủy</button>
        </form>
      )}
    </div>
  );
}