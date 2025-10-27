import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null); // user đang sửa

  // 🔹 Lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi tải user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Thêm user mới
  const addUser = async () => {
    if (!name || !email) return alert("Nhập đầy đủ tên và email!");
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  // 🔹 Xóa user
  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  // 🔹 Bắt đầu chỉnh sửa user
  const startEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  // 🔹 Cập nhật user
  const updateUser = async () => {
    if (!name || !email) return alert("Nhập đầy đủ tên và email!");
    try {
      const res = await fetch(`http://localhost:3000/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const updatedUser = await res.json();

      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      setEditingUser(null);
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Danh sách User</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {editingUser ? (
          <>
            <button onClick={updateUser} style={styles.buttonBlue}>
              Lưu
            </button>
            <button
            onClick={() => {
                setEditingUser(null);
                setName("");
                setEmail("");
              }}
              style={styles.buttonGray}
            >
              Hủy
            </button>
          </>
        ) : (
          <button onClick={addUser} style={styles.buttonGreen}>
            Thêm User
          </button>
        )}
      </div>

      <ul style={styles.userList}>
        {users.map((u) => (
          <li key={u._id || u.email} style={styles.userItem}>
            <strong>{u.name}</strong> - {u.email}
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => startEdit(u)} style={styles.buttonBlueSmall}>
                Sửa
              </button>
              <button onClick={() => deleteUser(u._id)} style={styles.buttonRedSmall}>
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 🎨 Style CSS-in-JS
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonGreen: {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  buttonBlue: {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2196f3",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  buttonGray: {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#777",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  userList: {
    listStyle: "none",
    padding: 0,
  },
  userItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  buttonBlueSmall: {
    marginRight: "8px",
    padding: "6px 10px",
    borderRadius: "5px",
    backgroundColor: "#2196f3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  buttonRedSmall: {
    padding: "6px 10px",
    borderRadius: "5px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};


export default App;