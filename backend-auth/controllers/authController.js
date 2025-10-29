const signup = (req, res) => {
  res.send("Signup route working");
};

const login = (req, res) => {
  res.send("Login route working");
};

const logout = (req, res) => {
  res.send("Logout route working");
};

module.exports = { signup, login, logout };