<template>
  <div class="manga-detail">
    <h1>{{ manga.title }}</h1>
    <img :src="manga.cover" alt="Cover" class="cover" />
    <p><strong>Tác giả:</strong> {{ manga.author }}</p>
    <p><strong>Thể loại:</strong> {{ manga.genre }}</p>
    <p><strong>Trạng thái:</strong> {{ manga.status }}</p>
    <p><strong>Tóm tắt:</strong> {{ manga.summary }}</p>
    <button v-if="isFavorite" @click="removeFromFavorites">Xóa khỏi yêu thích</button>
    <button v-else @click="addToFavorites">Thêm vào yêu thích</button>
    <h2>Danh sách chương</h2>
    <ul>
      <li v-for="chapter in chapters" :key="chapter._id">
        <router-link :to="`/chapter/${chapter._id}`">{{ chapter.title }}</router-link>
      </li>
    </ul>
    <h2>Bình luận</h2>
    <div class="comments">
      <div v-if="user" class="comment-form">
        <textarea v-model="newComment" placeholder="Viết bình luận..."></textarea>
        <button @click="submitComment">Gửi</button>
      </div>
      <div v-else class="comment-login">
        <router-link to="/login">Đăng nhập để bình luận</router-link>
      </div>
      <div v-for="comment in comments" :key="comment._id" class="comment">
        <p><strong>{{ comment.user.email }}</strong> ({{ comment.createdAt | formatDate }})</p>
        <p>{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import moment from 'moment';

export default {
  data() {
    return {
      manga: {},
      chapters: [],
      user: null,
      isFavorite: false,
      comments: [],
      newComment: ''
    };
  },
  filters: {
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    }
  },
  async created() {
    await this.fetchManga();
    await this.fetchChapters();
    await this.fetchUser();
    await this.fetchComments();
    this.checkFavorite();
  },
  methods: {
    async fetchManga() {
      try {
        const response = await api.getManga(this.$route.params.id);
        this.manga = response.data;
      } catch (err) {
        this.$toast.error('Lỗi khi tải thông tin truyện');
      }
    },
    async fetchChapters() {
      try {
        const response = await api.getChapters(this.$route.params.id);
        this.chapters = response.data;
      } catch (err) {
        this.$toast.error('Lỗi khi tải danh sách chương');
      }
    },
    async fetchUser() {
      try {
        const response = await api.getMe();
        this.user = response.data;
      } catch (err) {
        this.user = null;
      }
    },
    async fetchComments() {
      try {
        const response = await api.getComments();
        this.comments = response.data.filter(c => c.manga._id === this.$route.params.id);
      } catch (err) {
        this.$toast.error('Lỗi khi tải bình luận');
      }
    },
    checkFavorite() {
      if (this.user && this.user.favorites) {
        this.isFavorite = this.user.favorites.some(
          id => id.toString() === this.$route.params.id
        );
      }
    },
    async addToFavorites() {
      try {
        await api.addFavorite(this.$route.params.id);
        this.$toast.success('Đã thêm vào danh sách yêu thích');
        this.isFavorite = true;
        this.user.favorites.push(this.$route.params.id);
      } catch (err) {
        this.$toast.error('Lỗi khi thêm vào yêu thích');
      }
    },
    async removeFromFavorites() {
      try {
        await api.removeFavorite(this.$route.params.id);
        this.$toast.success('Đã xóa khỏi danh sách yêu thích');
        this.isFavorite = false;
        this.user.favorites = this.user.favorites.filter(
          id => id.toString() !== this.$route.params.id
        );
      } catch (err) {
        this.$toast.error('Lỗi khi xóa khỏi yêu thích');
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        this.$toast.error('Bình luận không được để trống');
        return;
      }
      try {
        await api.postComment({
          manga: this.$route.params.id,
          content: this.newComment
        });
        this.$toast.success('Đã gửi bình luận');
        this.newComment = '';
        await this.fetchComments();
      } catch (err) {
        this.$toast.error('Lỗi khi gửi bình luận');
      }
    }
  }
};
</script>

<style scoped>
.manga-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}
.cover {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}
button {
  margin: 10px 0;
  padding: 10px;
  background-color: #ff4500;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #e03e00;
}
.chapter-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.chapter-list li {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
.chapter-list a {
  text-decoration: none;
  color: #007bff;
}
.chapter-list a:hover {
  text-decoration: underline;
}
.comments {
  margin-top: 20px;
}
.comment-form textarea {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.comment-form button {
  background-color: #007bff;
}
.comment-form button:hover {
  background-color: #0056b3;
}
.comment-login a {
  color: #007bff;
  text-decoration: none;
}
.comment-login a:hover {
  text-decoration: underline;
}
.comment {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 10px;
}
.comment p {
  margin: 5px 0;
}
</style>