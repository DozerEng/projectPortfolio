const express = require('express');
const router = express.Router();

const ContentController = require("../controllers/content");

router.get('/:pageId', ContentController.content_get_page_content);

module.exports = router;