const express = require('express');

const router = express.Router();

const OrderControllers = require('../controllers/OrdersController');

const checkAuth = require('../auth/check-auth');

router.get('/', checkAuth, OrderControllers.getAllOrders);
router.get('/:orderId', checkAuth, OrderControllers.getOrderById);
router.post('/', checkAuth, OrderControllers.createOrder);
router.delete('/:orderId', checkAuth, OrderControllers.deleteOrder);

module.exports = router;
