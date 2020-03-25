const mongsoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/products');

class ProductsController {
  getAllProducts(req, res, next) {
    Product.find()
      .select('name price _id productImage')
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => ({
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage
          }))
        };
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

  createdProduct(req, res, next) {
    const product = new Product({
      _id: new mongsoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });

    product
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Product created',
          createdProduct: {
            _id: result._id,
            name: result.name,
            price: result.price,
            productImage: result.productImage
          }
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

  getProductById(req, res, next) {
    const id = req.params.productId;
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {
        console.log(doc);
        console.log(req.statusCode);
        if (doc !== null) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({ message: 'Entity does not exist' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

  updateProduct(req, res, next) {
    const id = req.params.productId;

    const update = {};

    for (const property of req.body) {
      update[property.propName] = property.value;
    }

    Product.update({ _id: id }, { $set: update })
      .exec()
      .then(result => {
        res.status(200).json({
          message: `Updated ${id}`,
          databaseDetailsResult: result
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

  deleteProduct(req, res, next) {
    const id = req.params.productId;

    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: `Deleted ${id}`,
          databaseDetailsResult: result
        });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
}

module.exports = new ProductsController();
