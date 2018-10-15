const Category = require('../models/categoryModel')

class CategoryController {

  static createCategory(req, res) {
    let data = {
      name: req.body.name
    }

    let category = new Category(data)
    category.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'creating category success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when create category',
          err: err.message
        })
      })
  }

  static updateCategory(req, res) {
    Category.updateOne({ _id: req.params.id }, { name: req.body.name })
      .then(data => {
        if (data.nModified == 1) {
          res.status(200).json({
            status: 'success',
            message: `updating cetegories with Id ${req.params.id} success`
          })
        } else {
          res.status(304).json()
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: `updating cetegories with Id ${req.params.id} failed`,
          err: err.message
        })
      })
  }

  static deleteCategory(req, res) {
    Category.deleteOne({ _id: req.params.id })
      .then(data => {
        if (data.nModified === 1) {
          res.status(200).json({
            status: 'success',
            message: `success when deleting category with id ${req.params.id}`
          })
        } else {
          res.status(304).json()
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: `failed when deleting data with id ${req.params.id}`,
          err: err.message
        })
      })
  }

  static getCategory(req, res) {
    Category.find()
      .then(data => {
        res.status(200).json({
          status: 'success',
          data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when getting data categories',
          err: err.message
        })
      })
  }

}

module.exports = CategoryController