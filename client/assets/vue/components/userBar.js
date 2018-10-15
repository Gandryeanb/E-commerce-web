Vue.component('user-bar', {
  data: function () {
    return {
      formCreateGudang: {
        name: ''
      },
      transactionView: false
    }
  },
  props: ['currentuser', 'host', 'currentview'],
  methods: {
    emitViewDefault() {
      this.$emit('changeview', 'default')
    },
    emitViewGudang() {
      this.$emit('changeview', 'gudang')
    },
    modalCreateGudang() {
      $('.ui.mini.modal.createGudang').modal('show')
    },
    createGudang() {
      axios({
          url: `${this.host}/shop`,
          method: 'post',
          headers: {
            token: localStorage.getItem('token')
          },
          data: this.formCreateGudang
        })
        .then(data => {
          this.$emit('resetuser')
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    viewTransaction() {
      this.transactionView = !this.transactionView
      this.$emit('transaction-change-view')
    }
  },
  template: `
    <div class="ui two wide column" v-if="currentuser">
      <div class="ui card">
      <div class="content image">
        <img src="https://storage.googleapis.com/avatarecommerce/facebook-default-no-profile-pic1.jpg">
      </div>
        <div class="content">
          <div class="header center aligned">
            <div class="meta">
              <p style="font-size: 15px;">login as</p>
            </div>
            <p>{{ currentuser.fname }}</p>
          </div>
        </div>
        <div class="extra attached content">
          <button class="ui small orange inverted fluid button" @click="modalCreateGudang" v-if="!currentuser.shop"> Create Gudang </button>
          <button class="ui small orange inverted fluid button" v-else-if="currentview === 'gudang'" @click=emitViewDefault> view shop items</button>
          <button class="ui small orange inverted fluid button" v-else @click=emitViewGudang> My Gudang </button>
          <button class="ui small orange inverted fluid button" :class="{disabled: currentview === 'gudang'}" style="margin-top:10px;" @click="viewTransaction"> My Transaction </button>
        </div>
      </div>

      <div class="ui mini modal createGudang">
        <div class="header">
          Create Gudang
        </div>
        <div class="ui form" style="padding: 20px;">
          <div class="ui field">
            <label>Name</label>
            <input type="text" placeholder="Your gudang name" v-model="formCreateGudang.name">
          </div>
        </div>
        <div class="actions">
          <div class="ui deny button">Cancel</div>
          <div class="ui deny orange button" @click="createGudang">Submit</div>
        </div>
      </div>

    </div>
  `
})