const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(422).json({
          message: 'Email adress already exists'
        });
      } else {
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
      }
    });
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed because of database error',
            error: err
          });
        }
        if (result) {
          return res.status(200).json({
            message: 'Auth succesfull'
          });
        }
        res.status(401).json({
          message: 'Auth failed by now'
        });
      });
    })
    .catch();
});

router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err =>
      res.status(500).json({
        message: 'Error occured while removing user from database',
        error: err
      })
    );
});

router.get('/', (req, res, next) => {});

module.exports = router;
