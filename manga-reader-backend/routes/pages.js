const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/chapter/:chapterId/pages', (req, res) => {
  const { chapterId } = req.params;
  db.query('SELECT * FROM pages WHERE chapter_id = ?', [chapterId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json(results);
  });
});

router.post('/chapter/:chapterId/pages', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  const { chapterId } = req.params;
  const { page_number } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : '';
  const query = 'INSERT INTO pages (chapter_id, page_number, image_url) VALUES (?, ?, ?)';
  db.query(query, [chapterId, page_number, image_url], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi thêm trang' });
    res.status(201).json({ id: result.insertId, chapter_id: chapterId, page_number, image_url });
  });
});

router.put('/page/:pageId', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  const { pageId } = req.params;
  const { page_number } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
  const query = 'UPDATE pages SET page_number = ?, image_url = ? WHERE id = ?';
  db.query(query, [page_number, image_url, pageId], (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi cập nhật trang' });
    res.json({ message: 'Cập nhật thành công' });
  });
});

router.delete('/page/:pageId', authMiddleware, adminMiddleware, (req, res) => {
  const { pageId } = req.params;
  db.query('DELETE FROM pages WHERE id = ?', [pageId], (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi xóa trang' });
    res.json({ message: 'Xóa thành công' });
  });
});

module.exports = router;