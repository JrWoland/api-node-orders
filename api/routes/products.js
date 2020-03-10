const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET /products'
  });
});

router.post('/', (req, res, next) => {
  const product = {
    _id: new mongsoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  };
  const product = new Product(product);
  res.status(201).json({
    message: 'Handling post /products',
    createdProduct: product
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'Special product is for you!',
      id: id
    });
  } else {
    res.status(200).json({
      message: 'Unknown id'
    });
  }
});
router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated id'
  });
});
router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted id'
  });
});

module.exports = router;
