const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Product = require('../models/product');

router.get('/', (request, response, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            console.log(docs);
            res = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
                        } 
                    }
                })
            }
            if (res.count >= 0)
                response.status(200).json(res)
            else
                response.status(200).json({})
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: error
            });
        });
});

router.post('/', (request, response, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price
    });
    product.save()
        .then(result => {
            console.log(result);
            response.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/"+result._id
                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: error
            })
        });
});

router.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                response.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                response.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error: error
            });
        });
});

router.patch('/:id', (request, response, next) => {
    const id = request.params.id;
    const updateOps = {};

    for (const ops of request.body)
        updateOps[ops.propName] = ops.value;

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then( result => {
            response.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+id
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

router.delete('/:id', (request, response, next) => {
    const id = request.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            response.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'GET',
                    description: 'Get all the products',
                    url: 'http://localhost:3000/products'
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