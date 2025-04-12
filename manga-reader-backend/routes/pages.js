const express = require('express');
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 📌 Lấy danh sách hình ảnh của một chương
router.get('/chapter/:chapterId/pages', (req, res) => {
  const query = 'SELECT * FROM pages WHERE chapter_id = ? ORDER BY page_number ASC';
  db.query(query, [req.params.chapterId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json(results);
  });
});

// 📌 Lấy chi tiết một trang
router.get('/page/:pageId', (req, res) => {
  const query = 'SELECT * FROM pages WHERE id = ?';
  db.query(query, [req.params.pageId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Không tìm thấy trang' });
    res.json(results[0]);
  });
});

// 📌 Thêm trang mới (cần truyền chapter_id trong body)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const { chapter_id, page_number, image_url } = req.body;
  const query = 'INSERT INTO pages (chapter_id, page_number, image_url) VALUES (?, ?, ?)';
  db.query(query, [chapter_id, page_number, image_url], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi thêm trang' });
    res.status(201).json({ id: result.insertId, chapter_id, page_number, image_url });
  });
});

// 📌 Cập nhật trang
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { page_number, image_url } = req.body;
  const query = 'UPDATE pages SET page_number = ?, image_url = ? WHERE id = ?';
  db.query(query, [page_number, image_url, req.params.id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy trang để cập nhật' });
    }
    res.json({ id: req.params.id, ...req.body });
  });
});

// 📌 Xóa trang
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const query = 'DELETE FROM pages WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy trang để xóa' });
    }
    res.json({ message: 'Xóa trang thành công' });
  });
});

// 📌 Upload ảnh trang mới
router.post('/chapter/:chapterId/pages/upload', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  const { page_number } = req.body;
  const image_url = `/uploads/${req.file.filename}`;
  const query = 'INSERT INTO pages (chapter_id, page_number, image_url) VALUES (?, ?, ?)';
  db.query(query, [req.params.chapterId, page_number, image_url], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi upload' });
    res.status(201).json({ id: result.insertId, image_url });
  });
});

module.exports = router;
