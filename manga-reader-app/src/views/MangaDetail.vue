<template>
  <div class="manga-detail">
    <header class="header">
      <h1>{{ manga.title }}</h1>
      <button @click="$router.push('/manga-list')" class="back-btn">Quay lại</button>
    </header>

    <div class="manga-info">
      <div class="cover">
        <img :src="manga.cover" :alt="manga.title" />
      </div>
      <div class="details">
        <p><strong>Tác giả:</strong> {{ manga.author }}</p>
        <p><strong>Thể loại:</strong> {{ manga.genre }}</p>
        <p><strong>Trạng thái:</strong> 
          <span :class="manga.status === 'Ongoing' ? 'ongoing' : 'completed'">
            {{ manga.status }}
          </span>
        </p>
        <p><strong>Tóm tắt:</strong> {{ manga.summary }}</p>
        <button 
          @click="toggleFavorite" 
          :class="{ 'favorited': isFavorite }"
          class="favorite-btn"
        >
          {{ isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích' }}
        </button>
      </div>
    </div>

    <div class="chapters">
      <h2>Danh Sách Chương</h2>
      <ul class="chapter-list">
        <li 
          v-for="chapter in chapters" 
          :key="chapter.id" 
          @click="goToChapter(chapter.id)"
          class="chapter-item"
        >
          <span>{{ chapter.title }}</span>
          <small>{{ chapter.pages }} trang - {{ chapter.status }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../api';
import { useToast } from 'vue-toastification';

export default {
  name: 'MangaDetailPage',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      manga: {},
      chapters: [],
      isFavorite: false
    };
  },
  async created() {
    const mangaId = parseInt(this.$route.params.id);
    try {
      const [mangaResponse, chaptersResponse] = await Promise.all([
        api.get(`/mangas/${mangaId}`),
        api.get(`/${mangaId}/chapters`)
      ]);
      this.manga = mangaResponse.data;
      this.chapters = chaptersResponse.data;
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      this.isFavorite = favorites.some(m => m.id === mangaId);
    } catch (err) {
      this.toast.error('Lỗi khi lấy dữ liệu');
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (this.isFavorite) {
        if (!favorites.some(m => m.id === this.manga.id)) {
          favorites.push(this.manga);
        }
      } else {
        favorites = favorites.filter(m => m.id !== this.manga.id);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.toast.success(this.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích');
    },
    goToChapter(chapterId) {
      this.$router.push(`/manga/${this.manga.id}/chapter/${chapterId}`);
    }
  }
};
</script>

<style scoped>
.manga-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h1 {
  font-size: 28px;
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

.manga-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.cover img {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.details {
  flex: 1;
}
.details p {
  margin: 10px 0;
}
.details strong {
  color: #333;
}
.ongoing {
  color: #e74c3c;
}
.completed {
  color: #2ecc71;
}
.favorite-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.favorite-btn.favorited {
  background-color: #2ecc71;
}

.chapters h2 {
  color: #333;
  margin-bottom: 15px;
}
.chapter-list {
  list-style: none;
  padding: 0;
}
.chapter-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.chapter-item:hover {
  background-color: #eee;
}
.chapter-item small {
  color: #777;
}
</style>