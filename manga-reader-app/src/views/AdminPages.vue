<template>
  <div class="admin-pages">
    <h1>Quản Lý Trang - {{ chapter?.title }}</h1>
    <button @click="$router.push(`/admin/chapters/${mangaId}`)" class="back-btn">Quay lại</button>

    <!-- Form thêm/sửa trang -->
    <section>
      <h2>{{ editingPage ? 'Sửa Trang' : 'Thêm Trang Mới' }}</h2>
      <form @submit.prevent="savePage" class="page-form" enctype="multipart/form-data">
        <input v-model="newPage.page_number" type="number" placeholder="Số trang" required />
        <input type="file" @change="onImageChange" accept="image/*" />
        <div class="form-buttons">
          <button type="submit">{{ editingPage ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingPage" @click="cancelEdit" type="button">Hủy</button>
        </div>
      </form>
    </section>

    <!-- Danh sách trang -->
    <section>
      <h2>Danh Sách Trang</h2>
      <table class="page-table">
        <thead>
          <tr>
            <th>Số Trang</th>
            <th>Preview Ảnh</th>
            <th>URL Ảnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in pages" :key="page.id">
            <td>{{ page.page_number }}</td>
            <td><img :src="getImageUrl(page.image_url)" alt="Preview" class="preview-img" /></td>
            <td>{{ page.image_url }}</td>
            <td>
              <button @click="editPage(page)" class="edit-btn">Sửa</button>
              <button @click="deletePage(page.id)" class="delete-btn">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import api from '../api';
import { useToast } from 'vue-toastification';

export default {
  name: 'AdminPagesPage',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      mangaId: null,
      chapter: {},
      pages: [],
      newPage: { page_number: '', image_url: null },
      editingPage: null
    };
  },
  async created() {
    if (!this.isAdmin) {
      this.$router.push('/login');
      return;
    }
    this.mangaId = this.$route.params.mangaId;
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
      const chapterId = this.$route.params.chapterId;
      try {
        const [chapterResponse, pagesResponse] = await Promise.all([
          api.get(`/chapter/${chapterId}`),
          api.get(`/chapter/${chapterId}/pages`)
        ]);
        this.chapter = chapterResponse.data;
        this.pages = pagesResponse.data;
      } catch (err) {
        const message = err.response?.data?.message || 'Lỗi khi lấy dữ liệu';
        this.toast.error(message);
      }
    },
    async savePage() {
      try {
        const formData = new FormData();
        formData.append('page_number', this.newPage.page_number);
        if (this.newPage.image_url instanceof File) {
          formData.append('image', this.newPage.image_url);
        }

        if (this.editingPage) {
          await api.put(`/page/${this.editingPage.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const index = this.pages.findIndex(p => p.id === this.editingPage.id);
          this.pages[index] = { ...this.newPage, id: this.editingPage.id, image_url: this.newPage.image_url instanceof File ? `/uploads/${this.newPage.image_url.name}` : this.newPage.image_url };
          this.toast.success('Cập nhật trang thành công');
        } else {
          const response = await api.post(`/chapter/${this.$route.params.chapterId}/pages`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.pages.push(response.data);
          this.toast.success('Thêm trang thành công');
        }
        this.newPage = { page_number: '', image_url: null };
        this.editingPage = null;
        await this.fetchData();
      } catch (err) {
        const message = err.response?.data?.message || 'Lỗi khi lưu trang';
        this.toast.error(message);
      }
    },
    onImageChange(event) {
      this.newPage.image_url = event.target.files[0];
    },
    getImageUrl(imageUrl) {
      return imageUrl ? `http://localhost:5000${imageUrl}` : '';
    },
    editPage(page) {
      this.newPage = { ...page, image_url: page.image_url };
      this.editingPage = page;
    },
    cancelEdit() {
      this.newPage = { page_number: '', image_url: null };
      this.editingPage = null;
    },
    async deletePage(id) {
      if (confirm('Bạn chắc chắn muốn xóa?')) {
        try {
          await api.delete(`/page/${id}`);
          this.pages = this.pages.filter(p => p.id !== id);
          this.toast.success('Xóa trang thành công');
          await this.fetchData();
        } catch (err) {
          const message = err.response?.data?.message || 'Lỗi khi xóa trang';
          this.toast.error(message);
        }
      }
    }
  }
};
</script>


<style scoped>
.admin-pages { padding: 20px; max-width: 1200px; margin: 0 auto; }
.back-btn { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px; }
.page-form { display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.form-buttons { display: flex; gap: 10px; }
button { padding: 10px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background-color: #c0392b; }
.page-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
th { background-color: #e74c3c; color: white; }
.edit-btn { background-color: #3498db; }
.delete-btn { background-color: #e74c3c; }
</style>