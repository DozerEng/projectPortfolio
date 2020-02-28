const mongoose = require("mongoose");

const Device = require("../models/devices");

exports.devices_get_all = (req, res, next) => {
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
}

exports.devices_create_device = (req, res, next) => {
    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        currentState: req.body.currentState,
        mainImage: req.file.path
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
                    mainImage: result.mainImage,
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
}

exports.devices_get_device = (req, res, next) => {
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
}

exports.devices_update_device = (req, res, next) => {
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
}

exports.devices_delete_device = (req, res, next) => {
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
}