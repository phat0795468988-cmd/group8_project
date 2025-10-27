// routes/users.js (Express)
const express = require('express');
const router = express.Router();

// GET /users
router.get('/', async (req, res) => {
  // lấy từ DB...
  const users = await User.find({});
  res.json(users);
});

// PUT /users/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  // ví dụ với mongoose:
  const updated = await User.findByIdAndUpdate(id, update, { new: true });
  res.json(updated);
});

// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(204).send(); // hoặc res.json({ success: true })
});

    module.exports = router;