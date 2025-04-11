<template>
  <div class="admin-chapters">
    <h1>Quản Lý Chương - {{ manga?.title }}</h1>
    <button @click="$router.push('/admin')" class="back-btn">Quay lại</button>

    <!-- Form thêm/sửa chương -->
    <section>
      <h2>{{ editingChapter ? 'Sửa Chương' : 'Thêm Chương Mới' }}</h2>
      <form @submit.prevent="saveChapter" class="chapter-form">
        <input v-model="newChapter.title" placeholder="Tên chương" required />
        <input v-model="newChapter.pages" type="number" placeholder="Số trang" required />
        <input v-model="newChapter.status" placeholder="Trạng thái" />
        <div class="form-buttons">
          <button type="submit">{{ editingChapter ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingChapter" @click="cancelEdit" type="button">Hủy</button>
        </div>
      </form>
    </section>

    <!-- Danh sách chương với tìm kiếm và phân trang -->
    <section>
      <h2>Danh Sách Chương</h2>
      <input v-model="searchQuery" placeholder="Tìm kiếm chương..." class="search-input" />
      <table class="chapter-table">
        <thead>
          <tr>
            <th @click="sortTable('title')">Tên Chương</th>
            <th @click="sortTable('pages')">Số Trang</th>
            <th @click="sortTable('status')">Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chapter in paginatedChapters" :key="chapter.id">
            <td>{{ chapter.title }}</td>
            <td>{{ chapter.pages }}</td>
            <td>{{ chapter.status }}</td>
            <td>
              <button @click="editChapter(chapter)" class="edit-btn">Sửa</button>
              <button @click="deleteChapter(chapter.id)" class="delete-btn">Xóa</button>
              <button @click="managePages(chapter.id)" class="manage-btn">Quản lý trang</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Sau</button>
      </div>
    </section>
  </div>
</template>

<script>
import api from '../api';
import { useToast } from 'vue-toastification';

export default {
  name: 'AdminChaptersPage',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      manga: {},
      chapters: [],
      newChapter: { title: '', pages: '', status: '' },
      editingChapter: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: '',
      sortOrder: 1
    };
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
    },
    filteredChapters() {
      if (!this.searchQuery) return this.chapters;
      return this.chapters.filter(chapter =>
        chapter.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    sortedChapters() {
      if (!this.sortKey) return this.filteredChapters;
      return [...this.filteredChapters].sort((a, b) => {
        const valueA = a[this.sortKey] || '';
        const valueB = b[this.sortKey] || '';
        return this.sortOrder * (valueA.toString().localeCompare(valueB.toString()));
      });
    },
    paginatedChapters() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedChapters.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredChapters.length / this.itemsPerPage);
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
        const message = err.response?.data?.message || 'Lỗi khi lấy dữ liệu';
        this.toast.error(message);
      }
    },
    async saveChapter() {
      try {
        if (this.editingChapter) {
          await api.put(`/chapter/${this.editingChapter.id}`, this.newChapter);
          const index = this.chapters.findIndex(ch => ch.id === this.editingChapter.id);
          this.chapters[index] = { ...this.newChapter, id: this.editingChapter.id };
          this.toast.success('Cập nhật chương thành công');
        } else {
          const response = await api.post(`/${this.$route.params.mangaId}/chapters`, this.newChapter);
          this.chapters.push(response.data);
          this.toast.success('Thêm chương thành công');
        }
        this.newChapter = { title: '', pages: '', status: '' };
        this.editingChapter = null;
        await this.fetchData();
      } catch (err) {
        const message = err.response?.data?.message || 'Lỗi khi lưu chương';
        this.toast.error(message);
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
          this.toast.success('Xóa chương thành công');
          await this.fetchData();
        } catch (err) {
          const message = err.response?.data?.message || 'Lỗi khi xóa chương';
          this.toast.error(message);
        }
      }
    },
    managePages(chapterId) {
      this.$router.push(`/admin/chapters/${this.$route.params.mangaId}/pages/${chapterId}`);
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder *= -1;
      } else {
        this.sortKey = key;
        this.sortOrder = 1;
      }
    }
  }
};
</script>

<style scoped>
.pagination { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
.pagination button { padding: 8px 16px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
.pagination button:disabled { background-color: #ccc; cursor: not-allowed; }
.admin-chapters { padding: 20px; max-width: 1200px; margin: 0 auto; }
.back-btn { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px; }
.chapter-form { display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.form-buttons { display: flex; gap: 10px; }
button { padding: 10px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background-color: #c0392b; }
.search-input { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; }
.chapter-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
th { background-color: #e74c3c; color: white; }
.edit-btn { background-color: #3498db; }
.delete-btn { background-color: #e74c3c; }
.manage-btn { background-color: #2ecc71; }
</style>