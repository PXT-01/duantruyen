<template>
    <div class="admin-pages">
      <h1>Quản Lý Trang - {{ chapter?.title }}</h1>
      <button @click="$router.push(`/admin/chapters/${mangaId}`)" class="back-btn">Quay lại</button>
  
      <!-- Form thêm/sửa trang -->
      <section>
        <h2>{{ editingPage ? 'Sửa Trang' : 'Thêm Trang Mới' }}</h2>
        <form @submit.prevent="savePage">
          <input v-model="newPage.page_number" type="number" placeholder="Số trang" required />
          <input v-model="newPage.image_url" placeholder="URL ảnh" required />
          <button type="submit">{{ editingPage ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingPage" @click="cancelEdit" type="button">Hủy</button>
        </form>
      </section>
  
      <!-- Danh sách trang -->
      <section>
        <h2>Danh Sách Trang</h2>
        <div v-for="page in pages" :key="page.id" class="page-item">
          <span>Trang {{ page.page_number }} - {{ page.image_url }}</span>
          <button @click="editPage(page)">Sửa</button>
          <button @click="deletePage(page.id)">Xóa</button>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'AdminPagesPage',
    data() {
      return {
        mangaId: null,
        chapter: {},
        pages: [],
        newPage: { page_number: '', image_url: '' },
        editingPage: null
      }
    },
    async created() {
      if (!this.isAdmin) {
        this.$router.push('/login');
        return;
      }
      this.mangaId = this.$route.params.mangaId;
      const chapterId = this.$route.params.chapterId;
      try {
        const [chapterResponse, pagesResponse] = await Promise.all([
          api.get(`/chapter/${chapterId}`),
          api.get(`/chapter/${chapterId}/pages`)
        ]);
        this.chapter = chapterResponse.data;
        this.pages = pagesResponse.data;
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
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
      async savePage() {
        try {
          if (this.editingPage) {
            await api.put(`/page/${this.editingPage.id}`, this.newPage);
            const index = this.pages.findIndex(p => p.id === this.editingPage.id);
            this.pages[index] = { ...this.newPage, id: this.editingPage.id };
          } else {
            const response = await api.post(`/chapter/${this.$route.params.chapterId}/pages`, this.newPage);
            this.pages.push(response.data);
          }
          this.newPage = { page_number: '', image_url: '' };
          this.editingPage = null;
        } catch (err) {
          console.error('Lỗi khi lưu trang:', err);
        }
      },
      editPage(page) {
        this.newPage = { ...page };
        this.editingPage = page;
      },
      cancelEdit() {
        this.newPage = { page_number: '', image_url: '' };
        this.editingPage = null;
      },
      async deletePage(id) {
        if (confirm('Bạn chắc chắn muốn xóa?')) {
          try {
            await api.delete(`/page/${id}`);
            this.pages = this.pages.filter(p => p.id !== id);
          } catch (err) {
            console.error('Lỗi khi xóa trang:', err);
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-pages { padding: 20px; max-width: 1200px; margin: 0 auto; }
  .back-btn { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
  section { margin-bottom: 30px; }
  form { display: flex; flex-direction: column; gap: 10px; }
  input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  button { padding: 8px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
  button:hover { background-color: #c0392b; }
  .page-item { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; background: #f9f9f9; padding: 10px; border-radius: 4px; }
  </style>