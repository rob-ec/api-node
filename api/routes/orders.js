const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (request, response, next) => {
    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            response.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            })
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: error
            });
        })
});

router.post('/', (request, response, next) => {
    Product.findById(request.body.productId)
        .then(product => {
            if (!product) {
                return response.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: request.body.quantity,
                product: request.body.productId
            });
            return order
                .save()

        })
        .then(result => {
            console.log(result);
            response.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(error => {
            response.status(500).json({
                message: "Product not found",
                error: error
            });
        });
});

router.get('/:id', (request, response, next) => {
    Order.findById(request.params.id)
        .exec()
        .then( order => {
            response.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    description: 'Get all the orders',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(error => {
            console.log(error);
            response.status(404).json({
                message: "Order not found",
                error: error
            });
        })
});

router.delete('/:id', (request, response, next) => {
    Order.remove({ _id: request.params.id })
        .exec()
        .then( order => {
            if (!order) {
                response.status(404).json({
                    message: "Order not found"
                });
            }
            response.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'GET',
                    description: 'Get all the orders',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: error
            });
        });
});

module.exports = router;