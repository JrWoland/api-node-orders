const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const Order = require('../models/orders');

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
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
  const order = new Order({
    _id: mongsoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId
  });
  order
    .save()
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
  res.status(200).json({
    message: 'Order details',
    orderId: req.params.orderId
  });
});
router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted',
    orderId: req.params.orderId
  });
});

module.exports = router;
