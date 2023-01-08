import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'vuehwyiru';

const app = {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      axios.post(`${url}/admin/signin`,this.user)
      .then((res) => {
        alert("登入成功")
        const { expired, token } = res.data;
        //保存token、experid(存在cookie中，就不必一直重新登入)
        document.cookie = `yiruToken=${ token }; expires=${ new Date(expired)};`;
        window.location = 'products.html'
      })
      .catch((err) => {
        alert(err.data.message)
      })
    }
  },
  mounted() {}
}

createApp(app).mount('#app')