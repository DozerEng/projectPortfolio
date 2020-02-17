const mongoose = require("mongoose");

const SmartHome = require("../models/smartHome");
const Device = require("../models/devices");

exports.smartHome_get_all = (req, res, next) => {
    SmartHome.find()
        .select("home device _id")
        .populate("device", "name") //name is the fields of device to populate
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                smartHome: docs.map(doc => {
                    return {
                        _id: doc._id,
                        device: doc.device,
                        home: doc.home,
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/smartHome/" + doc._id
                        }
                    }
                }),
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.smartHome_create_smart_home = (req, res, next) => {
    Device.findById(req.body.deviceId) //check for valid relationship
        .then(device => { 
            if (!device) { //Valid format, invalid ID
                return res.status(404).json({
                    message: "Device not found"
                });
            }
            const smartHome = new SmartHome({
                _id: mongoose.Types.ObjectId(),
                device: req.body.deviceId,
                home: req.body.home          
            });
            return smartHome.save()//added return due to nesting with promises
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Smart home created",
                createdSmartHome: {
                    _id: result._id,
                    device: result.device,
                    home: result.home
                },
                request: {
                    type: "GET",
                    url: "http://localhost:9000/smartHome/" + result._id
                }
            });
        })
        .catch(err => { //invalid format
            console.log(err);
            res.status(500).json({
                error: err
            });
        });    
}

exports.smartHome_get_device = (req, res, next) => {
    SmartHome.findById(req.params.smartHomeId)
        .populate("device") 
        .then(smartHome => {
            if (!smartHome) {
                return res.status(404).json({
                    message: "Smart home not found"
                })
            }
            res.status(200).json({
                smartHome: smartHome,
                request: {
                    type: "GET",
                    url: "http://localhost:9000/smartHome"
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.smartHome_delete_device = (req, res, next) => {
    SmartHome.deleteOne({ _id: req.params.smartHomeId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Smart home deleted",
                request: {
                    type: "GET",
                    url: "http://localhost:9000/smartHome",
                    body: { deviceId: "ID", home: "String"}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}