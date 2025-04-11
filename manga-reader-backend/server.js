const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const mangaRoutes = require('./routes/mangas');
const chapterRoutes = require('./routes/chapters');
const pageRoutes = require('./routes/pages');
const userRoutes = require('./routes/users'); // Thêm
const commentRoutes = require('./routes/comments'); // Thêm

dotenv.config();

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mangas', mangaRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/users', userRoutes); // Thêm
app.use('/api/comments', commentRoutes); // Thêm

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));