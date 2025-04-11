<template>
  <div class="admin">
    <h1>Quản Lý Admin</h1>
    <div class="nav-buttons">
      <button @click="$router.push('/')" class="back-btn">Quay lại</button>
      <button @click="$router.push('/admin/users')" class="users-btn">Quản lý người dùng</button>
      <button @click="$router.push('/admin/comments')" class="comments-btn">Quản lý bình luận</button>
      <button @click="fetchMangas" class="refresh-btn">Tải lại danh sách</button>
      <button @click="exportToCSV" class="export-btn">Xuất CSV</button>
    </div>

    <!-- Form thêm/sửa truyện -->
    <section>
      <h2>{{ editingManga ? 'Sửa Truyện' : 'Thêm Truyện Mới' }}</h2>
      <form @submit.prevent="saveManga" class="manga-form" enctype="multipart/form-data">
        <div class="form-group">
          <input v-model="newManga.title" placeholder="Tên truyện" required />
          <span v-if="errors.title" class="error">{{ errors.title }}</span>
        </div>
        <div class="form-group">
          <input v-model="newManga.author" placeholder="Tác giả" required />
          <span v-if="errors.author" class="error">{{ errors.author }}</span>
        </div>
        <div class="form-group">
          <input v-model="newManga.genre" placeholder="Thể loại" />
        </div>
        <div class="form-group">
          <select v-model="newManga.status" required>
            <option value="" disabled>Chọn trạng thái</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="form-group">
          <input type="file" @change="onCoverChange" accept="image/*" />
          <img v-if="coverPreview" :src="coverPreview" alt="Preview" class="cover-preview" />
        </div>
        <div class="form-group">
          <textarea v-model="newManga.summary" placeholder="Tóm tắt"></textarea>
        </div>
        <div class="form-buttons">
          <button type="submit">{{ editingManga ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingManga" @click="cancelEdit" type="button">Hủy</button>
          <button v-if="!editingManga" @click="resetForm" type="button">Xóa form</button>
        </div>
      </form>
    </section>

    <!-- Danh sách truyện với tìm kiếm và bộ lọc -->
    <section>
      <h2>Danh Sách Truyện</h2>
      <div v-if="isLoading" class="loading">Đang tải...</div>
      <div v-else>
        <div class="filters">
          <input v-model="searchQuery" placeholder="Tìm kiếm truyện..." class="search-input" />
          <select v-model="statusFilter" class="status-filter">
            <option value="">Tất cả trạng thái</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <select v-model="genreFilter" class="genre-filter">
            <option value="">Tất cả thể loại</option>
            <option v-for="genre in uniqueGenres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
        <table class="manga-table">
          <thead>
            <tr>
              <th @click="sortTable('cover')">Ảnh Bìa</th>
              <th @click="sortTable('title')">Tên Truyện</th>
              <th @click="sortTable('author')">Tác Giả</th>
              <th @click="sortTable('genre')">Thể Loại</th>
              <th @click="sortTable('status')">Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="manga in paginatedMangas" :key="manga.id" :title="`Số chương: ${manga.chapterCount || 0}`">
              <td><img :src="getImageUrl(manga.cover)" alt="Cover" class="preview-img" /></td>
              <td>{{ manga.title }}</td>
              <td>{{ manga.author }}</td>
              <td>{{ manga.genre }}</td>
              <td>{{ manga.status }}</td>
              <td>
                <button @click="editManga(manga)" class="edit-btn">Sửa</button>
                <button @click="showDeleteModal(manga)" class="delete-btn">Xóa</button>
                <button @click="manageChapters(manga.id)" class="manage-btn">Quản lý chương</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
          <select v-model="currentPage" class="page-select">
            <option v-for="page in totalPages" :key="page" :value="page">{{ page }}</option>
          </select>
          <span>/ {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Sau</button>
        </div>
      </div>
    </section>

    <!-- Thống kê -->
    <section>
      <h2>Thống Kê Thể Loại</h2>
      <div class="chart-controls">
        <button @click="chartType = 'bar'" :class="{ active: chartType === 'bar' }">Biểu đồ cột</button>
        <button @click="chartType = 'pie'" :class="{ active: chartType === 'pie' }">Biểu đồ tròn</button>
      </div>
      <div class="chart-container">
        <canvas ref="genreChart"></canvas>
      </div>
    </section>

    <!-- Modal xác nhận xóa -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="hideDeleteModal">
        <div class="modal">
          <h3>Xác nhận xóa</h3>
          <p>Bạn chắc chắn muốn xóa truyện <strong>{{ mangaToDelete?.title }}</strong>?</p>
          <div class="modal-buttons">
            <button @click="confirmDelete" class="confirm-btn">Xóa</button>
            <button @click="hideDeleteModal" class="cancel-btn">Hủy</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '../api';
import { useToast } from 'vue-toastification';
import Chart from 'chart.js/auto';

export default {
  name: 'AdminPage',
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      mangas: [],
      newManga: { title: '', author: '', genre: '', status: '', cover: null, summary: '' },
      editingManga: null,
      searchQuery: '',
      statusFilter: '',
      genreFilter: '',
      showModal: false,
      mangaToDelete: null,
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: '',
      sortOrder: 1,
      coverPreview: null,
      errors: {},
      chartInstance: null,
      chartType: 'bar',
      isLoading: false
    };
  },
  async created() {
    if (!this.isAdmin) {
      this.$router.push('/login');
      return;
    }
    await this.fetchMangas();
  },
  mounted() {
    this.$nextTick(() => {
      this.renderChart();
    });
  },
  watch: {
    mangas: {
      handler() {
        this.$nextTick(() => {
          this.renderChart();
        });
      },
      deep: true
    },
    chartType() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    filteredMangas() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    }
  },
  computed: {
    isAdmin() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.role === 'admin';
      } catch (err) {
        console.error('Invalid token', err);
        return false;
      }
    },
    uniqueGenres() {
      const genres = new Set(this.mangas.map(manga => manga.genre).filter(g => g));
      return [...genres];
    },
    filteredMangas() {
      let filtered = this.mangas;
      if (this.searchQuery) {
        filtered = filtered.filter(manga =>
          manga.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          manga.author.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.statusFilter) {
        filtered = filtered.filter(manga => manga.status === this.statusFilter);
      }
      if (this.genreFilter) {
        filtered = filtered.filter(manga => manga.genre === this.genreFilter);
      }
      return filtered;
    },
    sortedMangas() {
      if (!this.sortKey) return this.filteredMangas;
      return [...this.filteredMangas].sort((a, b) => {
        const valueA = a[this.sortKey] || '';
        const valueB = b[this.sortKey] || '';
        return this.sortOrder * (valueA.toString().localeCompare(valueB.toString()));
      });
    },
    paginatedMangas() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedMangas.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredMangas.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchMangas() {
      this.isLoading = true;
      try {
        const response = await api.get('/mangas');
        this.mangas = response.data.map(manga => ({
          ...manga,
          chapterCount: manga.chapterCount || 0
        }));
      } catch (err) {
        const message = err.response?.data?.message || 'Lỗi khi lấy danh sách truyện';
        this.toast.error(message);
      } finally {
        this.isLoading = false;
      }
    },
    validateForm() {
      this.errors = {};
      if (!this.newManga.title) this.errors.title = 'Tên truyện là bắt buộc';
      if (!this.newManga.author) this.errors.author = 'Tác giả là bắt buộc';
      if (!this.newManga.status) this.errors.status = 'Trạng thái là bắt buộc';
      return Object.keys(this.errors).length === 0;
    },
    async saveManga() {
      if (!this.validateForm()) return;

      try {
        const formData = new FormData();
        formData.append('title', this.newManga.title);
        formData.append('author', this.newManga.author);
        formData.append('genre', this.newManga.genre);
        formData.append('status', this.newManga.status);
        formData.append('summary', this.newManga.summary);
        if (this.newManga.cover instanceof File) {
          formData.append('cover', this.newManga.cover);
        }

        if (this.editingManga) {
          const response = await api.put(`/mangas/${this.editingManga.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const index = this.mangas.findIndex(m => m.id === this.editingManga.id);
          this.mangas.splice(index, 1, response.data);
          this.toast.success('Cập nhật truyện thành công');
        } else {
          const response = await api.post('/mangas', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.mangas.push(response.data);
          this.toast.success('Thêm truyện thành công');
        }
        this.resetForm();
      } catch (err) {
        const message = err.response?.data?.message || 'Lỗi khi lưu truyện';
        this.toast.error(message);
      }
    },
    onCoverChange(event) {
      const file = event.target.files[0];
      this.newManga.cover = file;
      if (file) {
        this.coverPreview = URL.createObjectURL(file);
      } else {
        this.coverPreview = null;
      }
    },
    getImageUrl(cover) {
      return cover ? `http://localhost:5000${cover}` : '';
    },
    editManga(manga) {
      this.newManga = { ...manga, cover: null };
      this.editingManga = manga;
      this.coverPreview = manga.cover ? this.getImageUrl(manga.cover) : null;
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.newManga = { title: '', author: '', genre: '', status: '', cover: null, summary: '' };
      this.editingManga = null;
      this.coverPreview = null;
      this.errors = {};
    },
    showDeleteModal(manga) {
      this.mangaToDelete = manga;
      this.showModal = true;
    },
    hideDeleteModal() {
      this.showModal = false;
      this.mangaToDelete = null;
    },
    async confirmDelete() {
      try {
        await api.delete(`/mangas/${this.mangaToDelete.id}`);
        this.mangas = this.mangas.filter(m => m.id !== this.mangaToDelete.id);
        this.toast.success('Xóa truyện thành công');
        this.hideDeleteModal();
      } catch (err) {
        const message = err.response?.data?.message || 'Lỗi khi xóa truyện';
        this.toast.error(message);
      }
    },
    manageChapters(mangaId) {
      this.$router.push(`/admin/chapters/${mangaId}`);
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
    },
    renderChart() {
      const canvas = this.$refs.genreChart;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Cannot get 2D context for canvas');
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const genres = {};
      this.mangas.forEach(manga => {
        const genre = manga.genre || 'Không xác định';
        genres[genre] = (genres[genre] || 0) + 1;
      });

      if (Object.keys(genres).length === 0) {
        console.warn('No genre data available for chart');
        return;
      }

      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

      this.chartInstance = new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: Object.keys(genres),
          datasets: [{
            label: 'Số lượng truyện',
            data: Object.values(genres),
            backgroundColor: this.chartType === 'pie' ? colors : '#e74c3c',
            borderColor: this.chartType === 'pie' ? '#fff' : '#e74c3c',
            borderWidth: 1
          }]
        },
        options: {
          scales: this.chartType === 'bar' ? {
            y: { beginAtZero: true }
          } : {},
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: this.chartType === 'pie'
            }
          }
        }
      });
    },
    exportToCSV() {
      const headers = ['ID', 'Tên Truyện', 'Tác Giả', 'Thể Loại', 'Trạng Thái', 'Tóm Tắt'];
      const rows = this.mangas.map(manga => [
        manga.id,
        `"${manga.title.replace(/"/g, '""')}"`,
        `"${manga.author.replace(/"/g, '""')}"`,
        `"${manga.genre.replace(/"/g, '""')}"`,
        manga.status,
        `"${(manga.summary || '').replace(/"/g, '""')}"`
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'mangas.csv';
      link.click();
    }
  }
};
</script>

<style scoped>
.admin {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.back-btn {
  background-color: #3498db;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.users-btn, .comments-btn, .export-btn {
  background-color: #2ecc71;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.refresh-btn {
  background-color: #f1c40f;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.manga-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.error {
  color: red;
  font-size: 0.9em;
}
.cover-preview {
  max-width: 100px;
  height: auto;
  margin-top: 10px;
}
.form-buttons {
  display: flex;
  gap: 10px;
}
button {
  padding: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #c0392b;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-input, .status-filter, .genre-filter {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.manga-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
}
.edit-btn {
  background-color: #3498db;
}
.delete-btn {
  background-color: #e74c3c;
}
.manage-btn {
  background-color: #2ecc71;
}
.preview-img {
  max-width: 50px;
  height: auto;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
}
.pagination button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.page-select {
  padding: 8px;
  border-radius: 4px;
}
.chart-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.chart-controls button {
  padding: 8px 16px;
  background-color: #3498db;
}
.chart-controls button.active {
  background-color: #e74c3c;
}
.chart-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 300px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
.confirm-btn {
  background-color: #e74c3c;
}
.cancel-btn {
  background-color: #3498db;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>