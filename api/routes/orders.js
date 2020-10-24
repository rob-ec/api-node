const checkAuth = require('../middleware/check-auth');
const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);
router.post('/', checkAuth, OrdersController.orders_create);

router.get('/:id', checkAuth, OrdersController.orders_get_by_id);
router.delete('/:id', checkAuth, OrdersController.orders_delete);

module.exports = router;