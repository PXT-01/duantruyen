const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Lấy thông tin user
router.get('/me', authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites readingHistory.manga readingHistory.chapter');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách user (admin)
router.get('/users', authMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật vai trò
router.put('/users/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Khóa/mở khóa user
router.put('/users/:id/block', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Đặt lại EXP
router.put('/users/:id/reset-exp', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { exp: 0, level: 1 }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật level
router.put('/users/:id/level', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { level: req.body.level }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xem danh sách yêu thích
router.get('/users/:id/favorites', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xem lịch sử đọc
router.get('/users/:id/history', authMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('readingHistory.manga readingHistory.chapter');
    res.json(user.readingHistory);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa user
router.delete('/users/:id', authMiddleware('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;