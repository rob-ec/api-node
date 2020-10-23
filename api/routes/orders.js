const { request, response } = require('express');
const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
    response.status(200).json({
        message: "Orders were fetched."
    });
});

router.post('/', (request, response, next) => {
    const order = {
        productId: request.body.productId,
        quantity: request.body.quantity
    }
    response.status(201).json({
        message: "Order Created.",
        order: order
    });
});

router.get('/:id', (request, response, next) => {
    response.status(200).json({
        message: "Order details",
        id: request.params.id
    });
});

router.delete('/:id', (request, response, next) => {
    response.status(200).json({
        message: "Order deleted!",
        id: request.params.id
    });
});

module.exports = router;