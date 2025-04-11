const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// Lấy danh sách bình luận
router.get('/', authMiddleware('admin'), async (req, res) => {
  try {
    const comments = await Comment.find().populate('user manga');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa bình luận
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa bình luận thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;