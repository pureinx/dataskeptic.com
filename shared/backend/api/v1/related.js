const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
    res.send('GET handler for /related route.');
});

module.exports = router;
