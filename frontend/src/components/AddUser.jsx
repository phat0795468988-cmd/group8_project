import React, { useState } from "react";
import { useUsersActions } from "../hooks/useUsers";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddUser() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { addUser } = useUsersActions();

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Tên không được để trống";
    if (!form.email.trim()) err.email = "Email không được để trống";
    else if (!emailRegex.test(form.email)) err.email = "Email không hợp lệ";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitting(true);
    const payload = { name: form.name.trim(), email: form.email.trim() };
    const res = await addUser(payload);
    setSubmitting(false);

    if (res.ok) {
      setForm({ name: "", email: "" });
      setErrors({});
      // tuỳ chọn: thông báo thành công
      alert("Thêm user thành công!");
    } else {
      // xử lý lỗi backend
      alert("Thêm thất bại, kiểm tra console");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Thêm User</h3>

      <div>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Tên"
        />
        {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
      </div>

      <div>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />
        {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Đang gửi..." : "Thêm"}
      </button>
    </form>
  );
}