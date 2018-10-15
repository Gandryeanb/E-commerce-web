Vue.component('cards-item', {
  data: function () {
    return {
      sizeCards: '',

      selectedItem: {
        id: '',
        name: '',
        photo: '',
        price: '',
        description: '',
        quantity: '',
        shopName: '',
        categoryName: ''
      },

      cart: []
    }
  },
  props: ['currentuser', 'host', 'itemsList', 'cartReset', 'transactionview'],
  computed: {
    totalItemsOnCart() {
      let count = 0
      this.cart.forEach(items => {
        items.forEach(item => {
          count++
        })
      })
      return count
    }
  },
  created() {
    if (!this.currentuser) {
      this.sizeCards = 'ui fourteen wide column'
    } else if (this.currentuser) {
      this.sizeCards = 'ui twelve wide column'
    }
  },
  watch: {
    transactionview() {
      if (this.currentuser && this.transactionview) {
        this.sizeCards = 'ui ten wide column'
      } else if (this.currentuser && !this.transactionview) {
        this.sizeCards = 'ui twelve wide column'
      }
    },
    cartReset(val) {
      this.cart = []
      this.$emit('totalitemsoncarts', this.totalItemsOnCart)
      this.$emit('itemsoncarts', this.cart)
    },
    currentuser() {
      if (this.currentuser) {
        this.sizeCards = 'ui twelve wide column'
      } else {
        this.sizeCards = 'ui fourteen wide column'
      }
    }
  },
  methods: {
    addToCart(item) {
      if (this.cart.length == 0) {
        this.cart.push([{
          id: item._id,
          name: item.name,
          price: item.price,
          shopId: item.shopId._id
        }])
      } else {
        let alreadyPush = false
        for (let i = 0; i < this.cart.length; i++) {
          if (String(this.cart[i][0].id) == String(item._id)) {
            alreadyPush = true
            this.cart[i].push({
              id: item._id,
              name: item.name,
              price: item.price,
              shopId: item.shopId._id
            })
          }
        }
        if (!alreadyPush) {
          this.cart.push([{
            id: item._id,
            name: item.name,
            price: item.price,
            shopId: item.shopId._id
          }])
        }
      }
      this.$emit('totalitemsoncarts', this.totalItemsOnCart)
      this.$emit('itemsoncarts', this.cart)
    },
    showDetailItemModal(id, name, photo, price, description, quantity, shopName, categoryName) {
      $('.ui.mini.modal.itemListDetail').modal('hide')
      this.selectedItem = {
        id,
        name,
        photo,
        price,
        description,
        quantity,
        shopName,
        categoryName
      }
      console.log(this.selectedItem)
      $('.ui.mini.modal.itemListDetail').modal('show')
    }
  },
  template: `
    <div class="" :class="sizeCards">
      <div class="ui five cards">
        <div class="card" v-for="item in itemsList">
          <div class="image" @click="showDetailItemModal(item._id, item.name, item.photo, item.price, item.description, item.quantity, item.shopId.name, item.categoryId.name )">
            <img :src="item.photo">
          </div>
          <div class="content">
            <div class="header">{{ item.name }}</div>
            <div class="meta">
              <a>Rp. {{ item.price }}</a>
            </div>
            <div class="description">
              {{ item.description }}
            </div>
          </div>
          <div class="extra content">
            <button class="ui mini right floated orange button" @click="addToCart(item)" :class="{ disabled: !currentuser }">
              add to cart
            </button>
            <p style="font-size:13px; margin-top:4px;">
              <i class="boxes icon"></i>
              {{ item.quantity }}
            </p>
          </div>
        </div>
      </div>

      <div class="ui mini modal itemListDetail">
        <div class="header">
          Detail Item
        </div>
        <div class="image">
          <img :src="selectedItem.photo" width=360></img>
        </div>
        <div class="content">
          <div class="ui grid">
            <div class="ui eight wide column form">
              <div class="field">
                <label>
                  <i class="ui box icon"></i>
                  Item name
                </label>
                <p>
                  {{selectedItem.name}}
                </p>
              </div>
            </div>
            <div class="ui eight wide column form">
              <div class="field">
                <label>
                  <i class="ui warehouse icon"></i>
                  Owner name:
                </label>
                <p>
                   Gudang {{selectedItem.shopName}}
                </p>
              </div>
            </div>
            <div class="ui six wide column form">
              <div class="field">
                <label>Item Price</label>
                <p>
                  Rp.{{selectedItem.price}}
                </p>
              </div>
            </div>
            <div class="ui five wide column form">
              <div class="field">
                <label>Category</label>
                <p>
                  {{selectedItem.categoryName}}
                </p>
              </div>
            </div>
            <div class="ui four wide column form">
              <div class="field">
                <label>
                  <i class="ui boxes icon"></i>
                  Stock
                </label>
                <p>
                  {{selectedItem.quantity}}
                </p>
              </div>
            </div>
            <div class="ui sixteen wide column form">
              <div class="field">
                <label>
                  <i class="ui file alternate icon"></i>
                  Item Description
                </label>
                <p>
                  {{selectedItem.description}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui deny mini orange inverted button">Dismiss</div>
          <div class="ui deny mini orange button">Add to card</div>
        </div>
      </div>
    </div>
  `
})