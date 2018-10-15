var app = new Vue({
  el: "#app",
  data: {
    host: "http://35.240.215.201",
    currentUser: null,
    currentRoleView: "default",
    currentUserView: "default",
    transactionView: false,

    itemsList: null,
    categoriesList: null,

    sumItemsOnCart: 0,
    cart: [],
    cartReset: false
  },
  created() {
    let token = localStorage.getItem("token");
    if (token) {
      this.getUser();
    }
    this.getCategories();
    this.getItems();
  },
  watch: {
    currentUserView() {
      if (this.currentUserView === "gudang") {
        this.transactionView = false;
      }
    },
    currentUser() {
      if (this.currentUser) {
        if (this.currentUser.role === "admin") {
          this.currentRoleView = "admin";
        }
      }
    }
  },
  methods: {
    changeTransactionView() {
      this.transactionView = !this.transactionView;
    },
    addValueCart(val) {
      this.cart = val;
    },
    addSumItemsOnCart(val) {
      this.sumItemsOnCart = val;
    },
    getItemByCategories(val) {
      if (val === "") {
        this.getItems();
      } else {
        axios({
            url: `${this.host}/items/category/${val}`,
            method: "get"
          })
          .then(data => {
            this.itemsList = data.data.newData;
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    },
    getQueryItem(val) {
      if (val === "") {
        this.getItems();
      } else {
        axios({
            url: `${this.host}/items/${val}`,
            method: "get"
          })
          .then(data => {
            this.itemsList = data.data.data;
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    },
    getItems() {
      axios({
          url: `${this.host}/items`,
          method: "get"
        })
        .then(data => {
          this.itemsList = data.data.data;
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    getCategories() {
      axios({
          url: `${this.host}/categories`,
          method: "get"
        })
        .then(data => {
          this.categoriesList = data.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetCurrentView() {
      this.currentRoleView = "default";
      this.currentUserView = "default";
    },
    changeViewUser(view) {
      this.currentUserView = view;
    },
    resetCurrentUser() {
      this.currentUser = null;
      this.cartReseter();
    },
    cartReseter() {
      this.cartReset = true;
      setTimeout(() => {
        this.cartReset = false;
      }, 100);
    },
    getUser() {
      axios({
          url: `${this.host}/users`,
          method: "get",
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(data => {
          localStorage.setItem("token", data.data.token);
          this.currentUser = data.data.user;
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  }
});