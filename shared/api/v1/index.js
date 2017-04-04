const express = require('express');
const router = express.Router();

router.use('/blog', require('./blog'));

module.exports = router;