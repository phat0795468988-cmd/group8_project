// models/userModel.js
let users = []; // Giả lập database trong bộ nhớ

module.exports = {
  getAll: () => users,
  findByEmail: (email) => users.find((u) => u.email === email),
  addUser: (user) => users.push(user),
};