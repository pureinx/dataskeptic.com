const express = require('express');
const router = express.Router();

router.use('/blog', require('./blog'));
router.use('/rfc', require('./rfc'));

module.exports = router;