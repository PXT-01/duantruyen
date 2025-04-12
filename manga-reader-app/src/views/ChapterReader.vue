<template>
    <div class="chapter-reader">
      <h1>{{ chapter?.title }}</h1>
      <button @click="$router.go(-1)" class="back-btn">Quay lại</button>
      <section class="pages">
        <div v-for="page in pages" :key="page.id" class="page">
          <img :src="getImageUrl(page.image_url)" :alt="'Page ' + page.page_number" class="page-img" />
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'ChapterReader',
    setup() {
      const toast = useToast();
      return { toast };
    },
    data() {
      return {
        chapter: {},
        pages: [],
        readTimer: null
      };
    },
    async created() {
      const chapterId = this.$route.params.chapterId;
      await this.fetchChapter(chapterId);
      await this.fetchPages(chapterId);
      this.startReadingTimer();
      this.incrementViews(chapterId);
    },
    beforeUnmount() {
      clearTimeout(this.readTimer);
    },
    methods: {
      async fetchChapter(chapterId) {
        try {
          const response = await api.getChapter(chapterId);
          this.chapter = response.data;
        } catch (err) {
          this.toast.error('Lỗi khi lấy thông tin chương');
        }
      },
      async fetchPages(chapterId) {
        try {
          const response = await api.getChapterPages(chapterId);
          this.pages = response.data;
        } catch (err) {
          this.toast.error('Lỗi khi lấy danh sách trang');
        }
      },
      getImageUrl(imageUrl) {
        return imageUrl ? `http://localhost:5000${imageUrl}` : '';
      },
      startReadingTimer() {
        this.readTimer = setTimeout(async () => {
          try {
            await api.readChapter(this.$route.params.chapterId);
            this.toast.success('Đã ghi nhận đọc chương');
          } catch (err) {
            this.toast.error('Lỗi khi ghi nhận đọc chương');
          }
        }, 60000); // 1 phút
      },
      async incrementViews(chapterId) {
        try {
          await api.incrementChapterViews(chapterId);
        } catch (err) {
          console.error('Lỗi khi tăng views', err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .chapter-reader {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  .back-btn {
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .pages {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .page-img {
    max-width: 100%;
    height: auto;
  }
  </style>