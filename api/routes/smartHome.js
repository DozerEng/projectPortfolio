const express = require('express');
const router = express.Router();

const SmartHomeController = require("../controllers/smartHome");
const checkAuth = require("../middleware/check-auth");

//Handling HTTP reuests
router.get('/', checkAuth, SmartHomeController.smartHome_get_all);

router.post('/', checkAuth, SmartHomeController.smartHome_create_smart_home);

router.get('/:smartHomeId', checkAuth, SmartHomeController.smartHome_get_device);

router.delete('/:smartHomeId', checkAuth, SmartHomeController.smartHome_delete_device);


module.exports = router;