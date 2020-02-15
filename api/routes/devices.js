const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Device = require('../models/devices');


router.get('/', (req, res, next) => {
    Device.find()
        .exec()
        .then(docs => {
            console.log(docs);
            //if (docs.length >= 0) {
                res.status(200).json(docs);
            //} else {
            //    res.status(200).json({
            //        message: "No entries found"
            //    });
            //}
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.post('/', (req, res, next) => {
    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        currentState: req.body.currentState
    });
    device
        .save()
        .then(result => {
            console.log(result); //*****************NOT PRINTING, RESULT IS NOT DEFINED LIKELY AN ISSUE WITH THE METHOD THEN() *****************************
            res.status(201).json({  //response to client
                message: 'Handling POST requests to /devices',
                createdDevice: device
            });
        }) 
        .catch(err => {
            console.log(err); //method for storing to mongo db
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:deviceId', (req, res, next) => {
    const id = req.params.productId;
    Device.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid entry found for device ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:deviceId', (req, res, next) => {
    const id = req.params.deviceId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;    //creates array of fields to be updated
    }
    Device.update({ _id: id }, { $set: updateOps }) //updates fields that were available
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:deviceId', (req, res, next) => {
    const id = req.params.deviceId;
    Device.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;