<template>
  <div class="container">
    登入頁面
    <form id="form" class="form-signin" @submit.prevent="login">
      <div class="form-floating mb-3">
        <input v-model="user.username" type="email" class="form-control" id="username"
          placeholder="name@example.com" required autofocus>
        <label for="username">Email address</label>
      </div>
      <div class="form-floating">
        <input v-model="user.password" type="password" class="form-control" id="password"
          placeholder="Password" required>
        <label for="password">Password</label>
      </div>
      <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
        登入
      </button>
    </form>
  </div>
</template>

<script>
const { VITE_APP_URL } = import.meta.env

export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$http.post(`${VITE_APP_URL}/admin/signin`, this.user)
        .then((res) => {
          alert('登入成功')
          const { expired, token } = res.data
          // 保存token、experid(存在cookie中，就不必一直重新登入)
          document.cookie = `yiruToken=${token}; expires=${new Date(expired)};`
          // window.location = 'products.html'
          this.$router.push('/admin/products')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  }
}
</script>
