const express = require('express');
const router = express.Router();

const UserController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

//Dont need logout method, stateless API so token will expire
router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete);

//not neccessary for API, strictly for troubleshooting and managing users
router.get('/', checkAuth, UserController.user_get_all);

module.exports = router;