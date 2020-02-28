const express = require('express');
const router = express.Router();
const multer = require("multer"); //parsing multi field form data

const OtherProjectsController = require("../controllers/otherProjects");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({ //Every file received will have the following functions called
    destination: function(req, file, cb) {
        cb(null, './public/images/otherProjects/');
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
        fileSize: 1024 * 1024 * 50 //1024 * 1024 * 5 is 5mb max size
    },
    fileFilter: fileFilter
}); 


//Handle HTTP requests
router.get('/', OtherProjectsController.otherProjects_get_all);

router.post('/', upload.single("mainImage"), OtherProjectsController.otherprojects_create_otherproject);

router.get('/:otherprojectId', OtherProjectsController.otherprojects_get_otherproject);

router.patch('/:otherprojectId', checkAuth, OtherProjectsController.otherprojects_update_otherproject);

router.delete('/:otherprojectId', OtherProjectsController.otherprojects_delete_otherproject);

module.exports = router;