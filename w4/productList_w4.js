import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagenation from './pagenation.js';

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'vuehwyiru';

//宣告modal
let productModal = "";
let delProductModal = "";

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,//確認是新增還是編輯
      page: {}
    }
  },
  components:{
    pagenation
  },
  methods: {
    checkLogin() {
      axios.post(`${url}api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "login.html";
        })
    },
    getData(page = 1) { //預設參數
      axios.get(`${url}api/${path}/admin/products?page=${page}`)
        .then((res) => {
          this.page = res.data.pagination;
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "login.html";
        })
    },
    //使用參數status，以分辨切換 是要新增 還是編輯；
    //參數product，只有編輯、刪除才要帶入當前資料
    openModal(status, product) {
      if (status === 'New') {
        productModal.show();//show為modal的呼叫方法
        this.isNew = true;
        //帶入要初始化的資料
        this.tempProduct = {
          imagesUrl: [],
        }
      } else if (status === 'Edit') {
        productModal.show()
        this.isNew = false;
        //帶入當前資料
        this.tempProduct = { ...product };
      } else if(status === 'Delete') {
        delProductModal.show();
        this.tempProduct = { ...product };//下方刪除，取id使用
      }
    },
    updateProduct() {
      //用isNew判斷API要post還是put
      if (this.isNew === true) { //新增post，要帶入{data}
        axios.post(`${url}api/${path}/admin/product`, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message);
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          })
      } else if (this.isNew === false) { //編輯put，要帶入{data}
        axios.put(`${url}api/${path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message);
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          })
      }
    },
    deleteProduct() {
      axios.delete(`${url}api/${path}/admin/product/${this.tempProduct.id}`)
      .then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        this.getData();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    //抓取modal動元素，new為modal的初始化
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

    //取出Token，驗證登入
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)yiruToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkLogin();
  }
});

app.component('productModal', {
  props: ['tempProduct', 'updateProduct', 'isNew','createImages'],
  template: '#productModal-template'
})

app.component('delProductModal', {
  props: ['tempProduct', 'deleteProduct'],
  template: '#delProductModal-template'
})

app.mount('#app')