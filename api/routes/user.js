const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/signup', (request, response, next) => {
    User.find({ email: request.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return response.status(409).json({
                    message: 'This email is already in use'
                });
            } else {
                bcrypt.hash(request.body.password, 10, (error, hash) => {
                    if (error) {
                        return response.status(500).json({
                            error: error
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: request.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                response.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(error => {
                                response.status(500).json({
                                    error: error
                                });
                            })
                    }
                });
            }
        });
});

router.post('/login', (request, response, next) => {
    User.find({ email: request.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return response.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(request.body.password, user[0].password, (error, result) => {
                if (error) {
                    return response.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jsonWebToken.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return response.status(200).json({
                        message: 'Auth succed',
                        token: token
                    });
                }
                return response.status(401).json({
                    message: 'Auth failed'
                });

            });
        })
        .catch(error => {
            response.status(500).json({
                error: error
            });
        });
});

router.delete('/:id', (request, response, next) => {
    User.remove({ _id: request.params.id })
        .exec()
        .then(order => {
            if (!order) {
                response.status(404).json({
                    message: "User not found"
                });
            }
            response.status(200).json({
                message: 'User deleted'
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