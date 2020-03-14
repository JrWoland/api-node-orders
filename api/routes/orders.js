const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name price')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        order: docs.map(doc => ({
          id: doc._id,
          product: doc.product,
          quantity: doc.quantity
        }))
      };
      res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(500).json({
          message: 'Product does not exist'
        });
      }
      const order = new Order({
        _id: mongsoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: product
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          id: result._id,
          product: result.product,
          quantity: result.quantity
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product', 'name price')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({
        order: order
      });
    })
    .catch(err => res.status(500).json({ error: err }));
});
router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result =>
      res.status(200).json({
        message: `Order deleted ${req.params.orderId}`
      })
    )
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
