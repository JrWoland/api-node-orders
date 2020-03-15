const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        message: 'Error occured while creating new user',
        error: err
      });
    } else {
      const user = new User({
        _id: mongsoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: 'User created'
          });
        })
        .catch(err =>
          res.status(500).json({
            message: 'Error occured while saving new user in database',
            error: err
          })
        );
    }
  });
});

module.exports = router;
