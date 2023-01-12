import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'vuehwyiru';

const app = {
  data() {
    return{
      tempProduct: {},
      products: [],
    }
  },
  methods: {
    checkLogin() {
      axios.post(`${url}/api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        })
    },
    getData() {
      axios.get(`${url}/api/${path}/admin/products`)
      .then((res) => {
        this.products = res.data.products;
      })
      .catch((err) => {
        alert(err.response.data.message);
        window.location = "login.html";
      })
    },
    openProduct(product) {
      this.tempProduct = product;
    }
  },
  mounted() {
    //把登入的cookie儲存，並夾在axios的headers中
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)yiruToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    //登入驗證
    this.checkLogin();
  }
}

createApp(app).mount('#app')