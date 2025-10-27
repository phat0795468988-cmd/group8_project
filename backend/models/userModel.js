let users = [];
let nextId = 1;

exports.getAll = () => users;

exports.create = ({ name, email }) => {
  const user = { id: nextId++, name, email };
  users.push(user);
  return user;
};