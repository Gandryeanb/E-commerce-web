var app = new Vue({
  el: '#app',
  data: {
    emailFormLogin: '',
    passwordFormLogin: '',

    fnameFormRegist: '',
    lnameFormRegist: '',
    emailFormRegist: '',
    passwordFormRegister: '',
    passwordFormRegisterFix: '',

    isAlreadyLogin: 0,
    cartsItem: [],
    querySearch: '',
    currentUser: '',
    selectedItem: {},
    selectedItemShopAddon: {},
    selectedTransaction: {},
    itemTransactions: [],

    viewGudang: 0,
    viewItem: 1,

    viewDefault: 1,
    viewTransaction: 0,

    cardsRow: 'ui six cards',
    selectedCategory: '',
    categoryList: [],
    itemList: [],

    host: 'http://localhost:3000'
  },
  computed: {
    totalItemsCard () {
      let count = 0
      for (let i = 0; i < this.cartsItem.length; i++){
        count += this.cartsItem[i].length
      }
      return count
    },
    subTotalCarts () {
      let sum = 0
      for (let i = 0; i < this.cartsItem.length; i++) {
        sum += this.cartsItem[i][0].price * this.cartsItem[i].length
      }

      return sum
    },
    subTotalTransaction () {
      let sum = 0
      for (let i = 0; i < this.itemTransactions.length; i++) {
        sum += this.itemTransactions[i][0].price * this.itemTransactions[i].length
      }
      
      return sum
    }
  },
  created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.fetchUserData()
    }
    this.fetchDataItems()
    this.fetchCategories()
  },
  watch: {
    selectedCategory() {
      this.fetchDataByCategory(this.selectedCategory)
    },
    querySearch() {
      this.fetchDataByQuery(this.querySearch)
    }
  },
  methods : {
    getShopData () {
      axios({
        url: `${this.host}/shop`,
        method: 'GET',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          console.log(data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetView(current) {
      this.viewGudang = 0
      this.viewItem = 0

      if (current == 'gudang') {
        this.viewGudang = 1
        this.getShopData()
      } else if (current == 'item') {
        this.viewItem = 1
      }
    },
    modalTransaction(transaction) {
      
      this.selectedTransaction = transaction
      this.itemTransactions = []

      for (let j = 0; j < transaction.item.length; j++) {
        if (this.itemTransactions.length === 0) {
          
          this.itemTransactions.push([transaction.item[j]])
        } else {
          let isPushed = false
          for (let i = 0; i < this.itemTransactions.length; i++) {
            if (String(this.itemTransactions[i][0].id) === String(transaction.item[j].id)) {
              this.itemTransactions[i].push(transaction.item[j])
              isPushed = true
            }
          }
          if (!isPushed) {
            this.itemTransactions.push([transaction.item[j]])
          }
        }
      }
      
      $('.ui.modal.transactionDetails').modal('show')
    },
    getTransaction() {
      axios({
        url: `${this.host}/transaction/user`,
        method: 'GET',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.currentUser.transaction = data.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    transactionDisplay() {
      
      if (this.cardsRow == 'ui six cards') {
        this.cardsRow = 'ui five cards'
      } else if (this.cardsRow == 'ui five cards') {
        if (this.currentUser) {
          this.getTransaction()
          console.log('asd')
          this.cardsRow = 'ui four cards'
        } else {
          this.cardsRow = 'ui six cards'
        }
      } else if (this.cardsRow == 'ui four cards') {
        if (this.currentUser) {
          this.cardsRow = 'ui five cards'
        } else {
          this.cardsRow = 'ui six cards'
        }
      }
    },
    register() {
      // if (this.fnameFormRegist == '') {
      //   console.log('First name required')
      // } else if ( this.emailFormRegist == '' ) {
      //   console.log('Email required')
      // } else if ( this.emailFormRegist.indexOf('@') == -1 ) {
      //   console.log('Email invalid')
      // } else if (this.emailFormRegist.indexOf('.') == -1 ) {
      //   console.log('Email invalid')
      // } else if ( this.passwordFormRegister == '') {
      //   console.log("password required")
      // } else if ( this.passwordFormRegister !== this.passwordFormRegisterFix ) {
      //   console.log("password did'nt match")
      // } else {
      //   console.log('success')
      // }

      axios({
        url: `${this.host}/register`,
        method: 'POST',
        data: {
          fname: this.fnameFormRegist,
          lname: this.lnameFormRegist,
          email: this.emailFormRegist,
          password: this.passwordFormRegisterFix
        }
      })
        .then(data => {
          console.log(data)
          // $('.ui.modal.regist').modal('hide')
          $('.ui.modal.login').modal('show')
        })
        .catch(err => {
          console.log(err)
        })
    },
    transactionView() {
      if (this.viewTransaction == 1) {
        this.viewTransaction = 0
      } else {
        this.viewTransaction = 1
      }
      this.transactionDisplay()
    },
    registModal () {
      $('.ui.modal.regist').modal('show')
    },
    cartModal() {
      $('.ui.modal.cart').modal('show')
    },
    fetchDataByQuery(query) {
      if (query === '') {
        this.fetchDataItems()
      } else {
        axios({
          url: `${this.host}/items/name/${query}`,
          method: 'GET'
        })
          .then(data => {
            this.itemList =  data.data.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    addToCart (obj) {
      if (this.cartsItem.length === 0) {
        this.cartsItem.push([obj])
      } else {
        let isPushed = false
        for (let i = 0; i < this.cartsItem.length; i++) {
          if (String(this.cartsItem[i][0]._id) === String(obj._id)) {
            this.cartsItem[i].push(obj)
            isPushed = true
          }
        }
        if (!isPushed) {
          this.cartsItem.push([obj])
        }
      }
      
    },
    fetchCategories () {
      axios({
        url: `${this.host}/categories`,
        method: 'GET'
      })
        .then(response => {
          this.categoryList = response.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchUserData () {
      
      let self = this
      axios({
        url: `${this.host}/users`,
        method: 'GET',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          localStorage.setItem('currentUser', response.data.user.fname)
          
          if (response.data.user.shop) {
            this.currentUser = {
              id: response.data.user.id,
              name: response.data.user.fname,
              transaction: response.data.user.transaction,
              shop: response.data.user.shop
            } 
            this.isAlreadyLogin = 1
          } else {
            this.currentUser = {
              name: response.data.user.fname,
              transaction: response.data.user.transaction
            }
          }
          this.transactionDisplay()
        })
        .catch(response => {
          console.log(response)
        })
    },
    fetchDataByCategory (params) {
      if (params === '') {
        this.fetchDataItems()
      } else {
        axios({
          url: `${this.host}/items/category/${params}`,
          method: 'GET'
        })
          .then(data => {
            this.itemList = data.data.newData
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    detailItem(itemObj){
      this.selectedItem = itemObj
      this.selectedItemShopAddon = itemObj.shopId.name
      
      $('.ui.mini.modal.detailItem').modal('show')
    },
    fetchDataItems () {
      axios({
        url: `${this.host}/items`,
        method: 'GET'
      })
        .then(response => {
          this.itemList = response.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    loginModal() {
      $('.ui.mini.modal.login').modal('show')
    },
    login() {
      axios({
        url: `${this.host}/login`,
        method: 'POST',
        data: {
          email: this.emailFormLogin,
          password: this.passwordFormLogin
        }
      })
        .then(response => {
          this.emailFormLogin = ''
          this.passwordFormLogin = ''
          this.isAlreadyLogin = 1
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('currentUser', response.data.currentUser)
          this.fetchUserData()
        })
        .catch(response => {
          this.emailFormLogin = ''
          this.passwordFormLogin = ''
          console.log(response)
        })
    },
    logout() {
      console.log('===================>')
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
      this.isAlreadyLogin = 0
      this.currentUser = null
      this.viewTransaction = 0
      this.transactionDisplay()
    }
  }
})