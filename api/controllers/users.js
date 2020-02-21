const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //encryption
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) { // User.find returns empty array if it doesnt find a match
                return res.status(409).json({ //409 resource already exists
                    message: "Email already has an account"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => { //10 is salt value
                    if (err) {
                        return res.status(500).json({
                            error:err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User created"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        });
                    }
                });
            }
        })
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email}) //can replace find with findOne and not then use "user" instead of "user[0]" since only should recieve at most 1 user
        .exec()
        .then(user => {
            if (user.length < 1 ) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            } 
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_get_all = (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        id: doc._id,
                        email: doc.email,
                        password: doc.password
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}