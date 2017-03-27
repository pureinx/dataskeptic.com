const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
    res.send('GET handler for /content route.');
});

module.exports = router;
