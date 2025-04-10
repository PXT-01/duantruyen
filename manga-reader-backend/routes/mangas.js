const express = require('express');
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách truyện
router.get('/', (req, res) => {
  const query = 'SELECT * FROM mangas';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
    res.json(results);
  });
});

// Lấy chi tiết truyện
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM mangas WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    res.json(results[0]);
  });
});

// Thêm truyện mới
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const { title, author, genre, status, cover, summary } = req.body;
  const query = 'INSERT INTO mangas (title, author, genre, status, cover, summary) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, author, genre, status, cover, summary], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi thêm truyện' });
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Cập nhật truyện
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { title, author, genre, status, cover, summary } = req.body;
  const query = 'UPDATE mangas SET title = ?, author = ?, genre = ?, status = ?, cover = ?, summary = ? WHERE id = ?';
  db.query(query, [title, author, genre, status, cover, summary, req.params.id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy truyện để cập nhật' });
    }
    res.json({ id: req.params.id, ...req.body });
  });
});

// Xóa truyện
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const query = 'DELETE FROM mangas WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy truyện để xóa' });
    }
    res.json({ message: 'Xóa truyện thành công' });
  });
});
module.exports = router;