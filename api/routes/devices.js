const express = require('express');
const router = express.Router();
const multer = require("multer"); //parsing multi field form data

const DevicesController = require("../controllers/devices");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({ //Every file received will have the following functions called
    destination: function(req, file, cb) {
        cb(null, './public/images/devices/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); //.replace(/:/g, '-') replaces : with - to conform to windows
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


//Handle HTTP requests
router.get('/', DevicesController.devices_get_all);

router.post('/', upload.single("mainImage"), DevicesController.devices_create_device);

router.get('/:deviceId', DevicesController.devices_get_device);

router.patch('/:deviceId', checkAuth, DevicesController.devices_update_device);

router.delete('/:deviceId', checkAuth, DevicesController.devices_delete_device);

module.exports = router;