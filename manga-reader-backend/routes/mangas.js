const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const authMiddleware = require('../middleware/auth'); // Thêm import
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb('Error: Images only!');
  }
});

router.get('/', async (req, res) => {
  try {
    const mangas = await Manga.find();
    res.json(mangas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Manga not found' });
    res.json(manga);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('cover'), authMiddleware('admin'), async (req, res) => {
  const { title, author, genre, status, summary } = req.body;
  const manga = new Manga({
    title,
    author,
    genre,
    status,
    summary,
    cover: req.file ? `/uploads/${req.file.filename}` : ''
  });
  try {
    const newManga = await manga.save();
    res.status(201).json(newManga);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.single('cover'), authMiddleware('admin'), async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Manga not found' });

    manga.title = req.body.title || manga.title;
    manga.author = req.body.author || manga.author;
    manga.genre = req.body.genre || manga.genre;
    manga.status = req.body.status || manga.status;
    manga.summary = req.body.summary || manga.summary;
    if (req.file) manga.cover = `/uploads/${req.file.filename}`;

    const updatedManga = await manga.save();
    res.json(updatedManga);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Manga not found' });
    await manga.remove();
    res.json({ message: 'Manga deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;