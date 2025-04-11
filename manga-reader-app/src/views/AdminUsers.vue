<template>
    <div class="admin-users">
      <h1>Quản Lý Người Dùng</h1>
      <div class="nav-buttons">
        <button @click="$router.push('/admin')" class="back-btn">Quay lại</button>
        <button @click="fetchUsers" class="refresh-btn">Tải lại</button>
      </div>
  
      <section>
        <h2>Danh Sách Người Dùng</h2>
        <div v-if="isLoading" class="loading">Đang tải...</div>
        <div v-else>
          <table class="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Cấp độ</th>
                <th>EXP</th>
                <th>Trạng thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.email }}</td>
                <td>
                  <select v-model="user.role" @change="updateUserRole(user)">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{{ user.level }}</td>
                <td>{{ user.exp }}</td>
                <td>{{ user.isBlocked ? 'Bị khóa' : 'Hoạt động' }}</td>
                <td>
                  <button @click="toggleBlock(user)" class="action-btn">
                    {{ user.isBlocked ? 'Mở khóa' : 'Khóa' }}
                  </button>
                  <button @click="resetExp(user.id)" class="action-btn">Đặt lại EXP</button>
                  <button @click="editLevel(user)" class="action-btn">Sửa level</button>
                  <button @click="viewFavorites(user.id)" class="action-btn">Yêu thích</button>
                  <button @click="viewHistory(user.id)" class="action-btn">Lịch sử</button>
                  <button @click="deleteUser(user.id)" class="delete-btn">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="editingUser" class="edit-level">
            <h3>Sửa Level: {{ editingUser.email }}</h3>
            <input v-model.number="newLevel" type="number" min="1" />
            <button @click="updateLevel">Lưu</button>
            <button @click="editingUser = null">Hủy</button>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'AdminUsersPage',
    setup() {
      const toast = useToast();
      return { toast };
    },
    data() {
      return {
        users: [],
        isLoading: false,
        editingUser: null,
        newLevel: 1
      };
    },
    async created() {
      if (!this.isAdmin) {
        this.$router.push('/login');
        return;
      }
      await this.fetchUsers();
    },
    computed: {
      isAdmin() {
        try {
          const token = localStorage.getItem('token');
          if (!token) return false;
          const decoded = JSON.parse(atob(token.split('.')[1]));
          return decoded.role === 'admin';
        } catch (err) {
          return false;
        }
      }
    },
    methods: {
      async fetchUsers() {
        this.isLoading = true;
        try {
          const response = await api.get('/auth/users');
          this.users = response.data;
        } catch (err) {
          this.toast.error('Lỗi khi lấy danh sách người dùng');
        } finally {
          this.isLoading = false;
        }
      },
      async updateUserRole(user) {
        try {
          await api.put(`/auth/users/${user.id}`, { role: user.role });
          this.toast.success('Cập nhật vai trò thành công');
        } catch (err) {
          this.toast.error('Lỗi khi cập nhật vai trò');
        }
      },
      async toggleBlock(user) {
        try {
          await api.put(`/auth/users/${user.id}/block`, { isBlocked: !user.isBlocked });
          user.isBlocked = !user.isBlocked;
          this.toast.success('Cập nhật trạng thái thành công');
        } catch (err) {
          this.toast.error('Lỗi khi cập nhật trạng thái');
        }
      },
      async resetExp(userId) {
        if (!confirm('Bạn chắc chắn muốn đặt lại EXP?')) return;
        try {
          await api.put(`/auth/users/${userId}/reset-exp`);
          const user = this.users.find(u => u.id === userId);
          user.exp = 0;
          user.level = 1;
          this.toast.success('Đặt lại EXP thành công');
        } catch (err) {
          this.toast.error('Lỗi khi đặt lại EXP');
        }
      },
      editLevel(user) {
        this.editingUser = user;
        this.newLevel = user.level;
      },
      async updateLevel() {
        try {
          await api.put(`/auth/users/${this.editingUser.id}/level`, { level: this.newLevel });
          this.editingUser.level = this.newLevel;
          this.toast.success('Cập nhật level thành công');
          this.editingUser = null;
        } catch (err) {
          this.toast.error('Lỗi khi cập nhật level');
        }
      },
      async viewFavorites(userId) {
        try {
          const response = await api.get(`/auth/users/${userId}/favorites`);
          const favorites = response.data;
          if (favorites.length === 0) {
            alert('Người dùng chưa có truyện yêu thích');
          } else {
            alert('Danh sách yêu thích:\n' + favorites.map(m => m.title).join('\n'));
          }
        } catch (err) {
          this.toast.error('Lỗi khi lấy danh sách yêu thích');
        }
      },
      async viewHistory(userId) {
        try {
          const response = await api.get(`/auth/users/${userId}/history`);
          const history = response.data;
          if (history.length === 0) {
            alert('Người dùng chưa có lịch sử đọc');
          } else {
            alert('Lịch sử đọc:\n' + history.map(h => `${h.manga.title} - ${h.chapter.title} (${new Date(h.readAt).toLocaleString()})`).join('\n'));
          }
        } catch (err) {
          this.toast.error('Lỗi khi lấy lịch sử đọc');
        }
      },
      async deleteUser(id) {
        if (confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
          try {
            await api.delete(`/auth/users/${id}`);
            this.users = this.users.filter(u => u.id !== id);
            this.toast.success('Xóa người dùng thành công');
          } catch (err) {
            this.toast.error('Lỗi khi xóa người dùng');
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-users { padding: 20px; max-width: 1200px; margin: 0 auto; }
  .nav-buttons { display: flex; gap: 10px; margin-bottom: 20px; }
  .back-btn, .refresh-btn { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
  .user-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
  th { background-color: #e74c3c; color: white; }
  .action-btn, .delete-btn { background-color: #e74c3c; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; }
  .action-btn { background-color: #3498db; }
  select { padding: 8px; border-radius: 4px; }
  .edit-level { margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
  .edit-level input { padding: 8px; margin-right: 10px; }
  .edit-level button { padding: 8px 16px; }
  .loading { text-align: center; padding: 20px; }
  </style>