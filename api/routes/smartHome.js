const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /smartHome'
    });
});

router.post('/', (req, res, next) => {
    const device = {
        deviceId: req.body.deviceId,
        currentState: req.body.currentState
    };
    res.status(201).json({
        message: 'Handling POST requests to /smartHome',
        addedDevice: device
    });
});

router.get('/:smartHomeId', (req, res, next) => {
    res.status(200).json({
        message: 'Smart home details',
        smartHomeId: req.params.smartHomeId
    });
});

router.delete('/:smartHomeId', (req, res, next) => {
    res.status(200).json({
        message: 'Smart home device deleted',
        smartHomeId: req.params.smartHomeId
    });
});


module.exports = router;