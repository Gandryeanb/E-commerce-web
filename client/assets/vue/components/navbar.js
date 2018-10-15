Vue.component('nav-bar', {
  data: function () {
    return {
      categoryList: {},
      registForm: {
        fname: '',
        lname: '',
        email: '',
        password: '',
        repassword: ''
      },
      loginForm: {
        email: '',
        password: ''
      },
      notif: {
        login: {
          message: ''
        },
        regist: {
          message: ''
        }
      },
      querySearch: '',
      categorySearch: ''
    }
  },
  props: ['host', 'currentuser', 'currentUserView', 'currentRoleView', 'categoriesList', 'sumItemsOnCart', 'cart'],
  watch: {
    querySearch() {
      this.$emit('query', this.querySearch)
    },
    categorySearch() {
      this.$emit('categoryquerry', this.categorySearch)
    }
  },
  computed: {
    subTotalPrice() {
      let total = 0
      for (let i = 0; i < this.cart.length; i++) {
        total += Number(this.cart[i][0].price) * Number(this.cart[i].length)
      }
      return total
    }
  },
  methods: {
    closeModalRegist() {
      this.notif.regist.message = ''
      this.registForm = {
        fname: '',
        lname: '',
        email: '',
        password: '',
        repassword: ''
      }
      $('.ui.modal.register').modal('hide')
    },
    login() {
      axios({
          url: `${this.host}/login`,
          method: 'post',
          data: {
            email: this.loginForm.email,
            password: this.loginForm.password
          }
        })
        .then(data => {
          localStorage.setItem('token', data.data.token)
          this.$emit('get-user')
          this.loginForm = {
            email: '',
            password: ''
          }
          this.notif.login.message = ''
          $('.ui.modal.login').modal('hide')
        })
        .catch(err => {
          let errMessage = err.response.data.message
          this.notif.login.message = errMessage
        })
    },
    register() {
      if (this.registForm.password === this.registForm.repassword && this.registForm.password !== '') {
        axios({
            url: `${this.host}/register`,
            method: 'post',
            data: {
              fname: this.registForm.fname,
              lname: this.registForm.lname,
              email: this.registForm.email,
              password: this.registForm.password
            }
          })
          .then(data => {
            this.notif.regist.message = ''
            this.registForm = {
              fname: '',
              lname: '',
              email: '',
              password: '',
              repassword: ''
            }
            $('.ui.modal.register').modal('hide')
          })
          .catch(err => {
            this.notif.regist.message = ''
            let errMessage = err.response.data.message
            if (err.response.data.message.indexOf('E11000') !== -1) {
              this.notif.regist.message = 'Email already taken'
            } else {
              this.notif.regist.message = errMessage.slice(24).split(',')[0].split(':')[1]
            }
          })
      } else {
        this.notif.regist.message = "Password didn't match"
      }
    },
    showLoginModal() {
      $('.ui.modal.login').modal('show')
    },
    showRegistModal() {
      $('.ui.modal.register').modal('show')
    },
    logout() {
      localStorage.removeItem('token')
      this.$emit('reset-user')
      this.$emit('reset-view')
    },
    showModalCart() {
      $('.ui.modal.cart').modal('hide')
      $('.ui.modal.cart').modal('show')
    },
    itemsSorter(cart) {
      let result = []
      for (let i = 0; i < cart.length; i++) {
        for (let j = 0; j < cart[i].length; j++) {
          result.push(cart[i][j])
        }
      }
      return result
    },
    checkout() {
      axios({
          url: `${this.host}/transaction`,
          method: 'post',
          headers: {
            token: localStorage.getItem('token')
          },
          data: {
            items: this.itemsSorter(this.cart)
          }
        })
        .then(data => {
          this.$emit('reset-items-list')
          this.$emit('reset-carts')
          this.$emit('get-user')
        })
        .catch(err => {
          console.log(err.response.data)
        })
    }
  },
  template: `
    <div class="ui segment">
      <div class="ui grid">
        <div class="ui two wide column">
          <div class="ui header" style="padding-top: 2.5%; color:orange">Buka Gudang</div>
        </div>
        <div class="ui two wide form column">
          <select class="ui fluid dropdown" v-if="currentRoleView === 'default' && currentUserView === 'default'" v-model="categorySearch">
            <option value="">All item</option>
            <option :value="category._id" v-for="category in categoriesList">
              {{category.name}}
            </option>
          </select>
        </div>
        <div class="ui eight wide column">
          <div class="ui icon fluid input" v-if="currentRoleView === 'default' && currentUserView === 'default'">
            <i class="ui search icon"></i>
            <input type="text" placeholder="Search your item" v-model="querySearch">
          </div>
        </div>
        <div class="ui one wide column">
          <div class="ui icon orange button" :class="{disabled: !currentuser || sumItemsOnCart === 0}" v-if="currentRoleView === 'default' && currentUserView === 'default'" @click="showModalCart">
            <i class="ui shop icon"></i>
            {{ sumItemsOnCart }}
          </div>
        </div>
        <div class="ui three wide column">
          <div class="ui orange inverted right floated button" @click="showLoginModal" v-if="!currentuser">
            login
          </div>
          <div class="ui orange inverted right floated button" @click="showRegistModal" v-if="!currentuser">
            sign-up
          </div>
          <div class="ui orange inverted right floated button" @click="logout" v-else>
            logout
          </div>
        </div>
      </div>

      <div class="ui small modal register">
        <div class="header">
          Register Form
        </div>
        <div class="ui form" style="padding: 20px;">
          <div class="two fields">
            <div class="field required">
              <label>First name</label>
              <input type="text" placeholder="First name" v-model="registForm.fname">
            </div>
            <div class="field">
              <label>Last name</label>
              <input type="text" placeholder="Last name" v-model="registForm.lname">
            </div>
          </div>
          <div class="three fields">
            <div class="field required">
              <label>Email</label>
              <input type="text" placeholder="Email" v-model="registForm.email">
            </div>
            <div class="field required">
              <label>Password</label>
              <input type="password" placeholder="password" v-model="registForm.password">
            </div>
            <div class="field required">
              <label>Password</label>
              <input type="password" placeholder="retype your password" v-model="registForm.repassword">
            </div>
          </div>
          <div class="field" v-if="notif.regist.message !== ''">
            <div class="ui negative mini message">
              <label>Error:</label>
              <div class="header">
                {{ notif.regist.message }}
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui dismiss button" @click="closeModalRegist">Cancel</div>
          <div class="ui orange button" @click="register">Submit</div>
        </div>
      </div>

      <div class="ui mini modal login">
        <div class="header">
          Login Form
        </div>
        <div class="ui form" style="padding: 20px;">
          <div class="ui field">
            <label>Email</label>
            <input type="text" v-model="loginForm.email">
          </div>
          <div class="ui field">
            <label>Password</label>
            <input type="password" v-model="loginForm.password">
          </div>
          <div class="field" v-if="notif.login.message !== ''">
            <div class="ui negative mini message">
              <label>Error:</label>
              <div class="header">
                {{ notif.login.message }}
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui deny button">Cancel</div>
          <div class="ui orange button" @click="login">Log me in</div>
        </div>
      </div>

      <div class="ui modal cart">
        <div class="header">
          <i class="ui shop icon"></i>
          Carts
        </div>
        <div class="ui small form" style="margin: 15px 30px;">
          <div class="four fields">
            <div class="field">
              <label><h3>Item name</h3></label>
            </div>
            <div class="field">
              <label><h3>Item price</h3></label>
            </div>
            <div class="field">
              <label><h3>Item amount</h3></label>
            </div>
            <div class="field">
              <label><h3>Item total price</h3></label>
            </div>
          </div>
            <div class="four fields" v-for="item in cart">
              <div class="field">
                <input type="text" readonly :value="item[0].name">
              </div>
              <div class="field">
                <input type="text" readonly :value="item[0].price">
              </div>
              <div class="field">
                <input type="number" :value="item.length">
              </div>
              <div class="field">
                <input type="text" readonly :value="item.length * item[0].price">
              </div>
            </div>
          <div class="four fields">
            <div class="field">
            </div>
            <div class="field">
            </div>
            <div class="field">
            </div>
            <div class="field">
              <label><h3>Sub total</h3></label>
              <input type="text" readonly :value="subTotalPrice">
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui deny orange inverted button">Cancel</div>
          <div class="ui deny orange button" @click="checkout">Check-out</div>
        </div>
      </div>


    </div>
  `
})