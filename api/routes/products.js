const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongsoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Handling post /products',
        createdProduct: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
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
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.patch('/:productId', (req, res, next) => {
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
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.delete('/:productId', (req, res, next) => {
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
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
