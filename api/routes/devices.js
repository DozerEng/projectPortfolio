const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /devices'
    });
});

router.post('/', (req, res, next) => {
    const device = {
        deviceId: req.body.deviceId, //data from api
        currentState: req.body.currentState //data from api
    };
    res.status(201).json({
        message: 'Handling POST requests to /devices',
        createdDevice: device
    });
});

router.get('/:deviceId', (req, res, next) => {
    const id = req.params.deviceId;
    if (id === 'camera') {
        res.status(200).json({
            message: 'You reached the camera device',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        });
    }
});

router.patch('/:deviceId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated device'
    });
});

router.delete('/:deviceId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted device'
    });
});

module.exports = router;