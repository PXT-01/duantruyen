const express = require('express');
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách chương của một truyện
router.get('/:mangaId/chapters', (req, res) => {
  const query = 'SELECT * FROM chapters WHERE manga_id = ?';
  db.query(query, [req.params.mangaId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
    res.json(results);
  });
});

// Lấy chi tiết một chương
router.get('/chapter/:chapterId', (req, res) => {
  const query = 'SELECT * FROM chapters WHERE id = ?';
  db.query(query, [req.params.chapterId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chương' });
    }
    res.json(results[0]);
  });
});

// Thêm chương mới
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const { title, pages, status } = req.body;
  const query = 'INSERT INTO chapters (manga_id, title, pages, status) VALUES (?, ?, ?, ?)';
  db.query(query, [req.params.mangaId, title, pages, status], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi thêm chương' });
    }
    res.status(201).json({ id: result.insertId, manga_id: req.params.mangaId, ...req.body });
  });
});

// Cập nhật chương
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { title, pages, status } = req.body;
  const query = 'UPDATE chapters SET title = ?, pages = ?, status = ? WHERE id = ?';
  db.query(query, [title, pages, status, req.params.chapterId], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chương để cập nhật' });
    }
    res.json({ id: req.params.chapterId, ...req.body });
  });
});

// Xóa chương
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const query = 'DELETE FROM chapters WHERE id = ?';
  db.query(query, [req.params.chapterId], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chương để xóa' });
    }
    res.json({ message: 'Xóa chương thành công' });
  });
});

module.exports = router;