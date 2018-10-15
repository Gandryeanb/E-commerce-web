const Item = require("../models/itemModel");
const Shop = require("../models/shopModel");
const itemFilterByCategory = require("../helpers/itemFilterByCategory");

class ItemController {
  static getItemByQuery(req, res) {
    Item.find({
        name: {
          $regex: `${req.params.name}`,
          $options: "i"
        },
        deleted: 0
      })
      .populate("shopId", "name")
      .then(data => {
        res.status(200).json({
          status: "success",
          data
        });
      })
      .catch(err => {
        res.status(500).json({
          status: "failed",
          message: "failed when getting data from Database",
          err: err.message
        });
      });
  }

  static getItemByCategories(req, res) {
    Item.find({
        deleted: 0
      })
      .populate("categoryId", "name")
      .then(data => {
        let newData = itemFilterByCategory(req.params.query, data);
        res.status(200).json({
          status: "success",
          newData
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          status: "failed",
          message: "error when get data",
          err: err.message
        });
      });
  }

  static getItem(req, res) {
    Item.find({
        deleted: 0
      })
      .populate("shopId", "name")
      .populate('categoryId', 'name')
      .then(data => {
        res.status(200).json({
          status: "success",
          data: data
        });
      })
      .catch(err => {
        res.status(500).json({
          status: "failed",
          message: "failed when get data from database",
          err: err.message
        });
      });
  }

  static myItem(req, res) {
    Item.find({
        shopId: req.decoded.shopId,
        deleted: 0
      })
      .populate("categoryId", "name")
      .then(data => {
        res.status(200).json({
          status: "success",
          data: data
        });
      })
      .catch(err => {
        res.status(500).json({
          status: "failed",
          message: err.message
        });
      });
  }

  static createItem(req, res) {
    let data = {
      photo: req.file.cloudStoragePublicUrl,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      shopId: req.decoded.shopId,
      categoryId: req.body.categoryId
    };

    let item = new Item(data);

    item
      .save()
      .then(data => {
        res.status(201).json({
          status: "success",
          message: "success creating item"
        });
      })
      .catch(err => {
        res.status(500).json({
          status: "failed",
          message: "failed when create item",
          err: err.message
        });
      });
  }

  static updateItem(req, res) {
    Item.updateOne({
        _id: req.params.id,
        shopId: req.decoded.shopId
      }, {
        photo: req.file.cloudStoragePublicUrl,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId
      })
      .then(data => {
        if (data.nModified != 0) {
          res.status(200).json({
            status: "success",
            message: "updating data item success"
          });
        } else {
          res.status(304).json();
        }
      })
      .catch(err => {
        res.status(500).json({
          status: "failed",
          message: "failed when updating data Item",
          err: err.message
        });
      });
  }

  static removeItem(req, res) {
    Item.updateOne({
        shopId: req.decoded.shopId,
        _id: req.params.id
      }, {
        deleted: 1
      })
      .then(data => {
        Shop.updateOne({
            _id: req.decoded.shopId
          }, {
            $pull: {
              items: req.params.id
            }
          })
          .then(data => {
            if (data.nModified == 1) {
              res.status(200).json({
                status: "success",
                message: "deleting data item success"
              });
            } else {
              res.status(304).json();
            }
          })
          .catch(err => {
            res.status(500).json({
              status: "failed",
              message: "deleting data item failed",
              err: err.message
            })
          });
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }
}

module.exports = ItemController;