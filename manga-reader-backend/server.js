const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mangaRoutes = require('./routes/mangas');
const chapterRoutes = require('./routes/chapters');
const pageRoutes = require('./routes/pages');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mangas', mangaRoutes);
app.use('/api', chapterRoutes);
app.use('/api', pageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});