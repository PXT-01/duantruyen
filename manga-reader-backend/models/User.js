const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }],
  readingHistory: [{
    manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    readAt: Date
  }]
});

module.exports = mongoose.model('User', userSchema);