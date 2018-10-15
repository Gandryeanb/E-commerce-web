const route = require('express').Router()
const ItemControler = require('../controllers/itemController')
const isLogin = require('../middlewares/isLogin')
const GCSupload = require('../helpers/GCSuploader')
const userOnly = require('../middlewares/userOnly')

route
  .get('/', ItemControler.getItem)
  .get('/shop', isLogin, ItemControler.myItem)
  .get('/:name', ItemControler.getItemByQuery)
  .get('/category/:query', ItemControler.getItemByCategories)
  .put('/:id', isLogin, GCSupload.multer.single('image'),
    GCSupload.sendUploadToGCS, ItemControler.updateItem)
  .delete('/:id', isLogin, ItemControler.removeItem)
  .post('/', isLogin, GCSupload.multer.single('image'),
    GCSupload.sendUploadToGCS, ItemControler.createItem)


module.exports = route