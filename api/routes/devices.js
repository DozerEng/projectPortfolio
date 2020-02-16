const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require("multer"); //parsing multi field (I think) form data

const Device = require('../models/devices');

const storage = multer.diskStorage({ //Every file received will have the following functions called
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); //.replace(/:/g, '-') replaces : with - to conform to windows
    }
});

const fileFilter = (req, file, cb) => { //Accept or reject, use 
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
}

const upload = multer({ //storage config for uploads
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //1024 * 1024 * 5 is 5mb max size
    },
    fileFilter: fileFilter
}); 



router.get('/', (req, res, next) => {
    Device.find()
        .select("name currentState _id deviceImage") //filters for fields in brackets
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                devices: docs.map(doc => {
                    return {
                        name: doc.name,
                        currentState: doc.currentState,
                        deviceImage: doc.deviceImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/devices/" + doc._id //creates link for client to responde to device, set to premanent url
                        }
                    }
                })
            };
            //console.log(docs);
            //if (docs.length >= 0) {
            res.status(200).json(response);
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


router.post('/', upload.single("deviceImage"),(req, res, next) => {
    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        currentState: req.body.currentState,
        deviceImage: req.file.path
    });
    device
        .save() //method for storing to mongo db
        .then(result => {
            console.log(result); 
            res.status(201).json({  //response to client
                message: 'Successfully added device',
                createdDevice: {
                    name: result.name,
                    currentState: result.currentState,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:9000/devices/" + result._id
                    }
                }
            });
        }) 
        .catch(err => {
            console.log(err); 
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:deviceId', (req, res, next) => {
    const id = req.params.deviceId;
    Device.findById(id) //mongoDB find by id from DB
        .select("name currentState _id deviceImage")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    device: doc,
                    request: {
                        type: "GET",
                        description: "Get all devices",
                        url: "http://localhost:9000/devices"
                    }
                });
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
        res.status(200).json({
            message: "Device updated",
            request: {
                type: "GET",
                url: "http://localhost:9000/devices/" + id
            }
        });
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
    Device.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Device delete",
            request: {
                type: "POST",
                url: "http://localhost:9000/devices/",
                body: { name: "String", currentState: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;