const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Page = require('../models/Page');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// ... (các route hiện có)

// Ghi nhận đọc chương
router.post('/:chapterId/read', authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const chapter = await Chapter.findById(req.params.chapterId).populate('manga');
    if (!chapter) return res.status(404).json({ message: 'Không tìm thấy chương' });

    // Thêm vào lịch sử đọc
    user.readingHistory.push({
      manga: chapter.manga._id,
      chapter: chapter._id,
      readAt: new Date()
    });

    // Tăng EXP (10 EXP mỗi chương)
    user.exp += 10;

    // Tính level
    const levelThresholds = [0, 100, 250, 500, 1000, 2000];
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (user.exp >= levelThresholds[i]) {
        user.level = i + 1;
        break;
      }
    }

    await user.save();
    res.json({ message: 'Đã ghi nhận đọc chương' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});
// Ghi nhận đọc chương
router.post('/:chapterId/read', authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const chapter = await Chapter.findById(req.params.chapterId).populate('manga');
    if (!chapter) return res.status(404).json({ message: 'Không tìm thấy chương' });

    // Thêm vào lịch sử đọc
    user.readingHistory.push({
      manga: chapter.manga._id,
      chapter: chapter._id,
      readAt: new Date()
    });

    // Tăng EXP (10 EXP mỗi chương)
    user.exp += 10;

    // Tính level
    const levelThresholds = [0, 100, 250, 500, 1000, 2000];
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (user.exp >= levelThresholds[i]) {
        user.level = i + 1;
        break;
      }
    }

    await user.save();
    res.json({ message: 'Đã ghi nhận đọc chương' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;