const express = require('express');
const router = express.Router();
const multer = require("multer"); //parsing multi field form data

const PrintsController = require("../controllers/prints");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({ //Every file received will have the following functions called
    destination: function(req, file, cb) {
        cb(null, './public/images/prints/');
    },
    filename: function(req, file, cb) {
        console.log(file.originalname);
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
        fileSize: 1024 * 1024 * 50 //1024 * 1024 * 5 is 5mb max size
    },
    fileFilter: fileFilter
}); 


//Handle HTTP requests
router.get('/', PrintsController.prints_get_all);

router.post('/', upload.single("mainImage"), PrintsController.prints_create_print);

router.get('/:printId', PrintsController.prints_get_print);

router.patch('/:printId', checkAuth, PrintsController.prints_update_print);

router.delete('/:printId', PrintsController.prints_delete_print);

module.exports = router;