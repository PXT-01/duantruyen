<template>
    <div class="admin">
      <h1>Quản Lý Admin</h1>
      <button @click="$router.push('/')" class="back-btn">Quay lại</button>
  
      <!-- Form thêm/sửa truyện -->
      <section>
        <h2>{{ editingManga ? 'Sửa Truyện' : 'Thêm Truyện Mới' }}</h2>
        <form @submit.prevent="saveManga">
          <input v-model="newManga.title" placeholder="Tên truyện" required />
          <input v-model="newManga.author" placeholder="Tác giả" required />
          <input v-model="newManga.genre" placeholder="Thể loại" />
          <input v-model="newManga.status" placeholder="Trạng thái" />
          <input v-model="newManga.cover" placeholder="URL ảnh bìa" />
          <textarea v-model="newManga.summary" placeholder="Tóm tắt"></textarea>
          <button type="submit">{{ editingManga ? 'Cập nhật' : 'Thêm' }}</button>
          <button v-if="editingManga" @click="cancelEdit" type="button">Hủy</button>
        </form>
      </section>
  
      <!-- Danh sách truyện -->
      <section>
        <h2>Danh Sách Truyện</h2>
        <div v-for="manga in mangas" :key="manga.id" class="manga-item">
          <span>{{ manga.title }} - {{ manga.author }}</span>
          <button @click="editManga(manga)">Sửa</button>
          <button @click="deleteManga(manga.id)">Xóa</button>
          <button @click="manageChapters(manga.id)">Quản lý chương</button>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import { useToast } from 'vue-toastification';

  export default {
    name: 'AdminPage',
    data() {
      return {
        mangas: [],
        newManga: { title: '', author: '', genre: '', status: '', cover: '', summary: '' },
        editingManga: null
      }
    },
    async created() {
      if (!this.isAdmin) {
        this.$router.push('/login');
        return;
      }
      await this.fetchMangas();
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
      async fetchMangas() {
        try {
          const response = await api.get('/mangas');
          this.mangas = response.data;
        } catch (err) {
          console.error('Lỗi khi lấy danh sách truyện:', err);
        }
      },
      async saveManga() {
        const toast = useToast();
  try {
    if (this.editingManga) {
      await api.put(`/mangas/${this.editingManga.id}`, this.newManga);
      const index = this.mangas.findIndex(m => m.id === this.editingManga.id);
      this.mangas[index] = { ...this.newManga, id: this.editingManga.id };
      this.$toast.success('Cập nhật truyện thành công');
    } else {
      const response = await api.post('/mangas', this.newManga);
      this.mangas.push(response.data);
      this.$toast.success('Thêm truyện thành công');
    }

    this.newManga = { title: '', author: '', genre: '', status: '', cover: '', summary: '' };
    this.editingManga = null;
  } catch (err) {
    console.error('Lỗi khi lưu truyện:', err);
    this.$toast.error('Lỗi khi lưu truyện');
  }
},

      editManga(manga) {
        this.newManga = { ...manga };
        this.editingManga = manga;
      },
      cancelEdit() {
        this.newManga = { title: '', author: '', genre: '', status: '', cover: '', summary: '' };
        this.editingManga = null;
      },
      async deleteManga(id) {
        if (confirm('Bạn chắc chắn muốn xóa?')) {
          try {
            await api.delete(`/mangas/${id}`);
            this.mangas = this.mangas.filter(m => m.id !== id);
          } catch (err) {
            console.error('Lỗi khi xóa truyện:', err);
          }
        }
      },
      manageChapters(mangaId) {
        this.$router.push(`/admin/chapters/${mangaId}`);
      }
    }
  }
  </script>
  
  <style scoped>
  .admin { padding: 20px; max-width: 1200px; margin: 0 auto; }
  .back-btn { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
  section { margin-bottom: 30px; }
  form { display: flex; flex-direction: column; gap: 10px; }
  input, textarea { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  button { padding: 8px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
  button:hover { background-color: #c0392b; }
  .manga-item { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; background: #f9f9f9; padding: 10px; border-radius: 4px; }
  </style>