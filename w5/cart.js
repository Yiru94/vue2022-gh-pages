import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'vuehwyiru';

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
            console.log('單一產品列表:', res.data.product);
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
      this.openModal('');
    })
  }
};

const app = createApp({
  data() {
    return {
      products: [],
      productId: "",
      cart: {},
      loadingItem: '', //存id，當此id存在就不能操作
      //isLoading: true,
    }
  },
  methods:{
    getProducts() {
      //this.isLoading = true;
      axios.get(`${url}api/${path}/products/all`)
        .then((res) => {
          console.log('產品列表:', res.data.products);
          this.products = res.data.products;
          //this.isLoading = false;
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
          console.log('加入購物車:', res.data)
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
          console.log('購物車列表:', res.data);
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
          console.log('修改購物車:', res.data)
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
          console.log('刪除購物車:', res.data)
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
          console.log('刪除全部購物車:', res.data)
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
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

console.log(VueLoading)
//loading
app.component('loading', VueLoading.Component);

app.mount('#app');