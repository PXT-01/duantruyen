<template>
    <div class="admin-chapters">
      <h1>Quản Lý Chương - {{ manga?.title }}</h1>
      <button @click="$router.push('/admin')" class="back-btn">Quay lại</button>
  
      <!-- Form thêm/sửa chương -->
      <section>
        <h2>{{ editingChapter ? 'Sửa Chương' : 'Thêm Chương Mới' }}</h2>
        <form @submit.prevent="saveChapter">
          <input v-model="newChapter.title" placeholder="Tên chương" required />
          <input v-model="newChapter.pages" type="number" placeholder="Số trang" required />
          <input v-model="newChapter.status" placeholder="Trạng thái" />
          <button type="submit">{{ editingChapter ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingChapter" @click="cancelEdit" type="button">Hủy</button>
        </form>
      </section>
  
      <!-- Danh sách chương -->
      <section>
        <h2>Danh Sách Chương</h2>
        <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
          <span>{{ chapter.title }} - {{ chapter.pages }} trang</span>
          <button @click="editChapter(chapter)">Sửa</button>
          <button @click="deleteChapter(chapter.id)">Xóa</button>
          <button @click="managePages(chapter.id)">Quản lý trang</button>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'AdminChaptersPage',
    data() {
      return {
        manga: {},
        chapters: [],
        newChapter: { title: '', pages: '', status: '' },
        editingChapter: null
      }
    },
    async created() {
      if (!this.isAdmin) {
        this.$router.push('/login');
        return;
      }
      await this.fetchData();
    },
    computed: {
      isAdmin() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.role === 'admin';
      }
    },
    methods: {
      async fetchData() {
        const mangaId = this.$route.params.mangaId;
        try {
          const [mangaResponse, chaptersResponse] = await Promise.all([
            api.get(`/mangas/${mangaId}`),
            api.get(`/${mangaId}/chapters`)
          ]);
          this.manga = mangaResponse.data;
          this.chapters = chaptersResponse.data;
        } catch (err) {
          console.error('Lỗi khi lấy dữ liệu:', err);
        }
      },
      async saveChapter() {
        try {
          if (this.editingChapter) {
            await api.put(`/chapter/${this.editingChapter.id}`, this.newChapter);
            const index = this.chapters.findIndex(ch => ch.id === this.editingChapter.id);
            this.chapters[index] = { ...this.newChapter, id: this.editingChapter.id };
          } else {
            const response = await api.post(`/${this.$route.params.mangaId}/chapters`, this.newChapter);
            this.chapters.push(response.data);
          }
          this.newChapter = { title: '', pages: '', status: '' };
          this.editingChapter = null;
        } catch (err) {
          console.error('Lỗi khi lưu chương:', err);
        }
      },
      editChapter(chapter) {
        this.newChapter = { ...chapter };
        this.editingChapter = chapter;
      },
      cancelEdit() {
        this.newChapter = { title: '', pages: '', status: '' };
        this.editingChapter = null;
      },
      async deleteChapter(id) {
        if (confirm('Bạn chắc chắn muốn xóa?')) {
          try {
            await api.delete(`/chapter/${id}`);
            this.chapters = this.chapters.filter(ch => ch.id !== id);
          } catch (err) {
            console.error('Lỗi khi xóa chương:', err);
          }
        }
      },
      managePages(chapterId) {
        this.$router.push(`/admin/chapters/${this.$route.params.mangaId}/pages/${chapterId}`);
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-chapters { padding: 20px; max-width: 1200px; margin: 0 auto; }
  .back-btn { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
  section { margin-bottom: 30px; }
  form { display: flex; flex-direction: column; gap: 10px; }
  input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  button { padding: 8px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
  button:hover { background-color: #c0392b; }
  .chapter-item { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; background: #f9f9f9; padding: 10px; border-radius: 4px; }
  </style>