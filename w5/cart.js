import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.prod.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'vuehwyiru';

//加入驗證規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

//查看商品
const productModal = {
  //當id變動時(用watch監聽)，去取得遠端資料，並呈現modal
  props: ['id', 'addToCart', 'openModal', 'loadingItem'],
  data() {
    return {
      modal: {},//需要一個位置作為實體化賦予的結果，對照下方mounted
      tempProduct: {},
      qty: 1,
    }
  },
  template: '#userProductModal',
  methods:{
    closeModal() {
      this.modal.hide();
    }
  },
  watch:{
    id() {
      if(this.id) {
        axios.get(`${url}api/${path}/product/${this.id}`)
          .then((res) => {
            this.tempProduct = res.data.product;
            this.modal.show();
          })
      }
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    //重複點查看，id並未改變，會顯示不出來
    //所以關閉modal時，要淨空id
    //props單向數據流，無法更動id，用外層方法處理
    this.$refs.modal.addEventListener('hidden.bs.modal', event => {
      this.qty = 1;
      this.openModal('');
    })
  }
};

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: "",
      cart: {},
      loadingItem: '', //存id，當此id存在就不能操作
      isLoading: false,
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: ''
      },
    }
  },
  methods:{
    getProducts() {
      this.isLoading = true;
      axios.get(`${url}api/${path}/products/all`)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    openModal(id) {
      this.productId = id;
    },
    addToCart(product_id, qty = 1) {//預設加入數量為1
      const data = {
        product_id,
        qty
      };
      this.loadingItem = product_id;
      axios.post(`${url}api/${path}/cart`, { data })
        .then((res) => {
          this.$refs.productModal.closeModal();
          this.getCarts();
          this.loadingItem = '';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    getCarts() {
      axios.get(`${url}api/${path}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateCartItem(item){
      const data = {
        product_id: item.product.id,
        qty: item.qty
      };
      this.loadingItem = item.id;//參照html的disabled功能
      axios.put(`${url}api/${path}/cart/${item.id}`, { data })
        .then((res) => {
          this.getCarts();
          this.loadingItem = '';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteItem(item){
      this.loadingItem = item.id;
      axios.delete(`${url}api/${path}/cart/${item.id}`)
        .then((res) => {
          this.getCarts();
          this.loadingItem = '';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteCarts() {
      axios.delete(`${url}api/${path}/carts`)
        .then((res) => {
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    //電話驗證
    isPhone(value) {
      if(!value) {
        return '電話 為必填'
      };
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    //送訂單
    sendOrder() {
      const order = this.form;
      axios.post(`${url}api/${path}/order`, { "data": order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();//淨空表單
          this.form.message = '';
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        })
    }
  },
  components:{
    productModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  }
});

//loading
app.component('loading', VueLoading.Component);

//VeeValidation
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');