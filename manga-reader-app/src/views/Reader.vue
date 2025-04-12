<template>
  <div class="reader">
    <h1>{{ manga.title }} - {{ chapter.title }}</h1>
    <button @click="$router.go(-1)" class="back-btn">Quay lại</button>
    <div class="controls">
      <select v-model="selectedChapter" @change="changeChapter">
        <option v-for="chap in chapters" :key="chap._id" :value="chap._id">
          {{ chap.title }}
        </option>
      </select>
      <button @click="prevPage" :disabled="currentPage === 0">Trang trước</button>
      <span>Trang {{ currentPage + 1 }} / {{ pages.length }}</span>
      <button @click="nextPage" :disabled="currentPage === pages.length - 1">Trang sau</button>
    </div>
    <div class="page-viewer">
      <img :src="currentPageImage" alt="Manga page" class="manga-page" />
    </div>
    <div class="size-controls">
      <label>Kích thước:</label>
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'ReaderPage',
  data() {
    return {
      manga: {},
      chapters: [],
      pages: [],
      currentPage: 0,
      zoomLevel: 1,
      selectedChapter: null
    };
  },
  computed: {
    currentPageImage() {
      return this.pages[this.currentPage]?.image_url || 'https://via.placeholder.com/800x1200?text=No+Image';
    }
  },
  async created() {
    const mangaId = this.$route.params.mangaId;
    const chapterId = this.$route.params.chapterId;
    try {
      const [mangaResponse, chaptersResponse, pagesResponse] = await Promise.all([
        api.getManga(mangaId),
        api.getChapters(mangaId),
        api.getChapterPages(chapterId)
      ]);
      this.manga = mangaResponse.data;
      this.chapters = chaptersResponse.data;
      this.pages = pagesResponse.data;
      this.selectedChapter = chapterId;
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err);
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.pages.length - 1) this.currentPage++;
    },
    async changeChapter() {
      this.currentPage = 0;
      try {
        const response = await api.getChapterPages(this.selectedChapter);
        this.pages = response.data;
        this.$router.push(`/manga/${this.manga.id}/chapter/${this.selectedChapter}`);
      } catch (err) {
        console.error('Lỗi khi đổi chương:', err);
      }
    },
    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
    },
    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    }
  }
};
</script>

<style scoped>
.reader {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.header h1 {
  font-size: 24px;
  color: #e74c3c;
}
.back-btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.controls select {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.controls button {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.page-viewer {
  text-align: center;
}
.manga-page {
  max-width: 100%;
  height: auto;
  transition: transform 0.2s;
}
.manga-page {
  transform: scale(v-bind(zoomLevel));
}
.size-controls {
  text-align: center;
  margin-top: 20px;
}
.size-controls button {
  padding: 6px 12px;
  margin: 0 5px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>