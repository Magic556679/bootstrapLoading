import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'wu9zo4s';

Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    //  取得products data
    getProducts(){
        const url = `${apiUrl}/api/${apiPath}/products`;
        axios.get(url).then((res)=>{
            if(res.data.success){
                this.products = res.data.products;
            } else {
                alert(res.data.messages);
            }
            
        });
    },

    //  查看更多
    getProduct(id){
        const url = `${apiUrl}/api/${apiPath}/product/${id}`;
        //啟用loading icon
        this.loadingStatus.loadingItem = id;
        axios.get(url)
        .then((res)=>{ 
            //清空loadingStatus  icon消失
            this.loadingStatus.loadingItem = '';
            this.product = res.data.product;
            this.$refs.userProductModal.openModal();
        });
    },

      //  新增到購物車
    addToCart(id, qty = 1) {
        const cart = {
            product_id: id,
            qty,
        };
        const url = `${apiUrl}/api/${apiPath}/cart`;
        this.loadingStatus.loadingItem = id;
        axios.post(url, {data: cart})
        .then((res)=>{
            this.loadingStatus.loadingItem = ''; 
            this.getCart();
        }); 
    },

    //  更新購物車
    updateCart(data){
        const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
        const cart = {
            product_id: data.product_id,
            qty: data.qty,
        };
        this.loadingStatus.loadingItem = data.id;
        axios.put(url, { data:cart })
        .then((res)=>{
            console.log(res);
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
            this.getCart();
        });
    },

    // 清空購物車
    deleteAllCarts(){
        const url = `${apiUrl}/api/${apiPath}/carts`;
        axios.delete(url)
        .then((res)=>{
            alert(res.data.message);
            this.getCart();
        })
    },

    // 刪除購物車單筆商品
    removeCartItem(id){
        const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
        this.loadingStatus.loadingItem = id;
        axios.delete(url)
        .then((res)=>{
            this.loadingStatus.loadingItem = '';
            alert(res.data.message);
            console.log(res);
            this.getCart();
        })
    },

    //  更新訂單
    createOrder(){
        const url = `${apiUrl}/api/${apiPath}/order`;
        const order = this.form;
        axios.post(url, { data:  order })
        .then((res)=>{
            alert(res.data.message);
            this.$refs.form.resetForm();
            this.getCart();
            console.log(res);
        })
    },

    //  取得購物車內容
    getCart() {
        const url = `${apiUrl}/api/${apiPath}/cart`;
        axios.get(url).then((response) => {
          if (response.data.success) {
            this.cart = response.data.data;
            
          } else {
            alert(response.data.message);
          }
        });
    },
  },
  
  created() {
    this.getProducts();
    this.getCart();
  },
})
  .component('userProductModal', userProductModal)
  .mount('#app');
