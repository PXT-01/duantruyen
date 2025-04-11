// models/Manga.js
const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  author: String,
  genres: [String],
  coverImage: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Manga', mangaSchema);
