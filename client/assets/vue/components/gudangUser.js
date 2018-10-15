Vue.component("gudang-user", {
  data: function () {
    return {
      createItemView: false,
      createItemForm: {
        name: "",
        image: "",
        description: "",
        price: "0",
        categoryId: "",
        quantity: "0"
      },
      myItem: null,
      myTransaction: null,
      selectedItem: {
        photo: "",
        name: "",
        description: "",
        price: "",
        categoryId: "",
        quantity: ""
      }
    };
  },
  watch: {
    createItemForm: {
      deep: true,
      handler() {
        if (this.createItemForm.price < 0) {
          this.createItemForm.price = 0
        }
        if (this.createItemForm.price.length > 1 && this.createItemForm.price[0] == 0) {
          this.createItemForm.price = this.createItemForm.price[1]
        }
        if (this.createItemForm.quantity < 0) {
          this.createItemForm.quantity = 0
        }
        if (this.createItemForm.quantity.length > 1 && this.createItemForm.quantity[0] == 0) {
          this.createItemForm.quantity = this.createItemForm.quantity[1]
        }
        if (this.createItemForm.quantity > 200) {
          this.createItemForm.quantity = 200
        }
        if (this.createItemForm.quantity === "") {
          this.createItemForm.quantity = 0
        }
        if (this.createItemForm.price === "") {
          this.createItemForm.price = 0
        }
      }
    },
    selectedItem: {
      deep: true,
      handler() {
        if (this.selectedItem.price < 0) {
          this.selectedItem.price = 0
        }
        if (this.selectedItem.price.length > 1 && this.selectedItem.price[0] == 0) {
          this.selectedItem.price = this.selectedItem.price[1]
        }
        if (this.selectedItem.quantity < 0) {
          this.selectedItem.quantity = 0
        }
        if (this.selectedItem.quantity.length > 1 && this.selectedItem.quantity[0] == 0) {
          this.selectedItem.quantity = this.selectedItem.quantity[1]
        }
        if (this.selectedItem.quantity > 200) {
          this.selectedItem.quantity = 200
        }
        if (this.selectedItem.quantity === "") {
          this.selectedItem.quantity = 0
        }
        if (this.selectedItem.price === "") {
          this.selectedItem.price = 0
        }
      }
    }
  },
  props: ["currentuser", "categoriesList", "host"],
  created() {
    this.getMyItem();
    this.getMyTransaction();
  },
  methods: {
    getMyTransaction() {
      axios({
          url: `${this.host}/transaction/shop`,
          method: 'get',
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(data => {
          let fiveData = []
          for (let i = 0; i < 5; i++) {
            fiveData.push(data.data.data[i])
          }
          this.myTransaction = fiveData
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    getMyItem() {
      axios({
          url: `${this.host}/items/shop`,
          method: `get`,
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(data => {
          if (data.data.data.length === 0) {
            this.myItem = null
          } else {
            this.myItem = data.data.data;
          }
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    insertFile(event) {
      this.createItemForm.image = event.target.files[0];
    },
    createItem() {
      let formdata = new FormData();

      formdata.append("image", this.createItemForm.image);
      formdata.append("name", this.createItemForm.name);
      formdata.append("description", this.createItemForm.description);
      formdata.append("price", this.createItemForm.price);
      formdata.append("categoryId", this.createItemForm.categoryId);
      formdata.append("quantity", this.createItemForm.quantity);

      axios
        .post(`${this.host}/items`, formdata, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(data => {
          this.createItemForm = {
            name: "",
            image: "",
            description: "",
            price: "",
            categoryId: "",
            quantity: ""
          };
          this.viewCreateDiv()
          this.getMyItem()
          this.$emit('reset-items-list')
        })
        .catch(err => {
          console.log(err.response.data)
          console.log(JSON.parse(JSON.stringify(err.response.data.message)));
        });
    },
    viewDefault() {
      this.$emit("changeview", "default");
    },
    viewCreateDiv() {
      this.createItemView = !this.createItemView;
    },
    showModalMyItem(
      photo,
      name,
      price,
      quantity,
      description,
      categoryName,
      id
    ) {
      this.selectedItem = {
        photo,
        name,
        price,
        quantity,
        description,
        categoryName,
        id
      };
      $(".ui.modal.update.myItem").modal("show");
    },
    insertFileUpdate(event) {
      this.selectedItem.photo = event.target.files[0];
    },
    updateItem() {
      let formData = new FormData();

      formData.append("image", this.selectedItem.photo);
      formData.append("name", this.selectedItem.name);
      formData.append("description", this.selectedItem.description);
      formData.append("price", this.selectedItem.price);
      formData.append("categoryId", this.selectedItem.categoryName);
      formData.append("quantity", this.selectedItem.quantity);

      axios
        .put(`${this.host}/items/${this.selectedItem.id}`, formData, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(data => {
          console.log('success')
          this.getMyItem()
          this.$emit('reset-items-list')
          $(".ui.modal.update.myItem").modal("hide");
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    deleteItem(id) {
      axios({
          url: `${this.host}/items/${id}`,
          method: 'delete',
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(data => {
          this.getMyItem()
          this.$emit('reset-items-list')
        })
        .catch(err => {
          console.log(err.response.data.message)
        })
    },
    getTotalProfit(items) {
      let totalProfit = 0
      items.forEach(item => {
        if (this.currentuser.shop._id === item.shopId) {
          totalProfit += item.price
        }
      })
      return totalProfit
    },
    summarySoldItem(items) {
      let msg = `From selling`
      let itemName = []

      for (let i = 0; i < items.length; i++) {
        if (items[i].shopId === this.currentuser.shop._id) {
          if (itemName.length === 0) {
            itemName.push([items[i].name])
          } else if (itemName[itemName.length - 1][0] == items[i].name) {
            itemName[itemName.length - 1].push(items[i].name)
          } else {
            itemName.push([items[i].name])
          }
        }
      }
      for (let i = 0; i < itemName.length; i++) {
        msg += ` ${itemName[i][0]} x ${itemName[i].length} pcs,`
      }
      return msg
    }
  },
  template: `
    <div class="ui twelve wide column">
      <div class="ui grid">
        <div class="ui sixteen wide column">
          <div class="ui grid">
            <div class="ui four wide column">
              <div class="ui orange inverted two item menu">
                <a class="ui item" @click="viewDefault">
                  <i class="ui left arrow icon"></i>
                  Back to shop
                </a>
                <a class="ui right item" @click="viewCreateDiv">
                  <i class="ui plus icon"></i>
                  Sell new item
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="ui four wide column">        
          <div class="ui segment">
            <div class="content">
              <div class="ui dividing orange header">
                My Gudang Info
              </div>
              <div class="field">
                <h4>Gudang id:</h4>
                {{ this.currentuser.shop._id }}
              </div>
              <div class="field" style="margin-top:10px">
                <h4>Gudang name:</h4>
                {{ this.currentuser.shop.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="ui eight wide column">
          <div class="ui segment">
            <div class="ui dividing orange header">
              List Item
            </div>
          </div>
          <div class="ui segment" v-if="createItemView">
            <div class="ui form">
              <div class="two fields">
                <div class="field">
                  <label>Photo for your items</label>
                  <input type="file" v-on:change="insertFile">
                </div>
                <div class="field">
                  <label>Your items name</label>
                  <input type="text" v-model="createItemForm.name">
                </div>
              </div>
              <div class="three fields">
                <div class="field">
                  <label>Item Category</label>
                  <select class="ui dropdown" v-model="createItemForm.categoryId">
                    <option :value="category._id" v-for="category in categoriesList">
                      {{category.name}}
                    </option>
                  </select>
                </div>
                <div class="field">
                  <label>Item Price</label>
                  <input type="number" placeholder="Item price" v-model="createItemForm.price">
                </div>
                <div class="field">
                  <label>Item Quantity</label>
                  <input type="number" placeholder="Max 200" v-model="createItemForm.quantity">
                </div>
              </div>
              <div class="field">
                <label>Description</label>
                <textarea rows=4 v-model="createItemForm.description"></textarea>
              </div>
              <div class="field">
                <div class="ui icon fluid mini orange button" @click="createItem">
                  <i class="ui plus icon"></i>
                  Sell my new Item
                </div>
              </div>
              <div class="field">
                <div class="ui mini fluid button" @click="viewCreateDiv">
                  Cancel
                </div>
              </div>
            </div>
          </div>
          <div class="ui segment">
            <div class="ui link divided items" v-if="myItem !== null">
              <div class="item" v-for="item in myItem">
                <div class="ui small image">
                  <img :src="item.photo">
                </div>
                <div class="content">
                  <div class="header">{{item.name}}</div>
                  <div class="meta">
                    <span class="price">Rp. {{item.price}}</span><br><br>
                    <span class="stay">
                      <i class="boxes icon"></i>
                      {{item.quantity}}
                    </span>
                  </div>
                  <div class="description">
                    <p>{{ item.description }}.</p>
                  </div>
                </div>
                <div class="action">
                  <div class="ui orange mini icon button" @click="showModalMyItem(item.photo, item.name, item.price, item.quantity, item.description, item.categoryId._id, item._id)">
                    <i class="ui pencil icon"></i>
                    Edit
                  </div>
                  <div class="ui orange mini inverted icon button" @click="deleteItem(item._id)">
                    <i class="ui trash icon"></i>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <h4 style="color:orange">You don't have item list yet</h4>
            </div>
          </div>
        </div>
        <div class="ui four wide column">
          <div class="ui segment">
            <div class="content">
              <div class="ui dividing orange header">
                Recently Transaction
              </div>
            </div>
          </div>
          <div class="ui link one cards">
            <div class="card" v-for="transaction in myTransaction" v-if="myTransaction[0]">
              <div class="content">
                <div class="header">{{ new Date(transaction.createdAt).getDate() }}-{{ new Date(transaction.createdAt).getMonth() + 1 }}-{{ new Date(transaction.createdAt).getFullYear() }}</div>
                <div class="meta">Total Profit : Rp.{{ getTotalProfit(transaction.item) }}</div>
                <div class="description">
                  {{ summarySoldItem(transaction.item) }}
                </div>
              </div>
            </div>
            <div class="ui segment" style="margin-top:15px;">
              <h4 style="color:orange">You don't have transaction list yet</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="ui small modal update myItem">
        <div class="header">
          Update items
        </div>
        <div class="image content">
          <div class="image">
            <img :src="this.selectedItem.photo" width=300>
            <input type="file" @change="insertFileUpdate">
          </div>
          <div class="ui content">
            <div class="ui form">
              <div class="ui two fields">
                <div class="field">
                  <label>Item Name</label>
                  <input type="text" v-model="selectedItem.name">
                </div>
                <div class="field">
                  <label>Price</label>
                  <input type="number" min="0" v-model="selectedItem.price">
                </div>
              </div>
              <div class="ui two fields">
                <div class="field">
                  <label>Category</label>
                  <select class="ui dropdown" v-model="selectedItem.categoryName">
                    <option :value="category._id" v-for="category in categoriesList">
                      {{category.name}}
                    </option>
                  </select>
                </div>
                <div class="field">
                  <label>Quantity</label>
                  <input type="number" v-model="selectedItem.quantity">
                </div>
              </div>
              <div class="field">
                <label>Description</label>
                <textarea v-model="selectedItem.description"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui mini deny button">Cancel</div>
          <div class="ui mini orange button" @click="updateItem">update</div>
        </div>
      </div>
    </div>
  `
});