// models/Manga.js
const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    genre: String,
    status: String,
    summary: String,
    cover: String,
    views: { type: Number, default: 0 }, // Thêm
    createdAt: { type: Date, default: Date.now } // Thêm
  });

module.exports = mongoose.model('Manga', mangaSchema);
