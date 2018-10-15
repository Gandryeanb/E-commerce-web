Vue.component("transaction-list", {
  data: function () {
    return {
      myTransactionUser: null,
      selectedTransaction: [],
      selectedTransactionSubtotal: 0,
      selectedTransactionCreatedAt: 0
    };
  },
  props: ['currentuser', 'host', 'currentuserview'],
  created() {
    this.getMyTransaction()
  },
  methods: {
    getMyTransaction() {
      axios({
          url: `${this.host}/transaction/user`,
          method: 'get',
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(data => {
          this.myTransactionUser = data.data.data
        })
        .catch(err => {
          console.log(err.respose.data)
        })
    },
    itemSorter(item) {

    },
    viewTransaction(transaction) {
      this.selectedTransactionSubtotal = transaction.totalPrice
      this.selectedTransaction = []
      this.selectedTransactionCreatedAt = `${new Date(transaction.createdAt).getDate()}-${new Date(transaction.createdAt).getMonth() +1}-${new Date(transaction.createdAt).getFullYear()}`

      for (let i = 0; i < transaction.item.length; i++) {
        if (this.selectedTransaction.length == 0) {
          this.selectedTransaction.push([{
            id: transaction.item[i].id,
            name: transaction.item[i].name,
            price: transaction.item[i].price
          }])
        } else {
          let alreadyPush = false
          for (let j = 0; j < this.selectedTransaction.length; j++) {
            if (String(this.selectedTransaction[j][0].id) == String(transaction.item[i].id)) {
              alreadyPush = true
              this.selectedTransaction[j].push({
                id: transaction.item[i].id,
                name: transaction.item[i].name,
                price: transaction.item[i].price
              })
            }
          }
          if (!alreadyPush) {
            this.selectedTransaction.push([{
              id: transaction.item[i].id,
              name: transaction.item[i].name,
              price: transaction.item[i].price,
            }])
          }
        }
      }
      $('.ui.modal.transactionDetail').modal('show')
    }

  },
  template: `
    <div class="ui two wide column">
      <div class="ui vertical menu">
        <a class="active orange item">
          <h3>Transaction list</h3>
        </a>
        <a class="item" v-for="transaction in myTransactionUser" @click="viewTransaction(transaction)">
          {{ new Date(transaction.createdAt).getDate() }}-{{ new Date(transaction.createdAt).getMonth()+1 }}-{{ new Date(transaction.createdAt).getFullYear() }}
        </a>
      </div>

      <div class="ui modal transactionDetail">
        <div class="header">
          <i class="ui file alternate icon"></i>
          Transaction {{ selectedTransactionCreatedAt }}
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
            <div class="four fields" v-for="item in selectedTransaction">
              <div class="field">
                <input type="text" readonly :value="item[0].name">
              </div>
              <div class="field">
                <input type="text" readonly :value="item[0].price">
              </div>
              <div class="field">
                <input type="number" readonly :value="item.length">
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
              <input type="text" readonly :value="selectedTransactionSubtotal">
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui deny orange inverted button">Dismiss</div>
        </div>
      </div>
    </div>
  `
})