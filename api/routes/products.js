const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/images');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix} ${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 1024 * 1024
  }
});

const Product = require('../models/products');

router.get('/', (req, res, next) => {
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
});

router.post('/', upload.single('productImage'), (req, res, next) => {
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
});

router.get('/:productId', (req, res, next) => {
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
      res.status(500).json({ error: err });
    });
});

module.exports = router;
