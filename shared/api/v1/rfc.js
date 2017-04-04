const express = require('express');
const axios = require('axios');
const router = express.Router();

const ENV = process.env.NODE_ENV || 'dev';

const RSS = require('rss');

const map = require('lodash/map');
const each = require('lodash/each');
const filter = require('lodash/filter');

router.get('/list', function (req, res) {
    const topic = "Do you think Tensor Processing Units (TPUs) will totally replace GPUs for deep learning?";
    const description = "Deep learning requires GPUs to achieve good results in a reasonable amount of time on many problems.  Presently, it seems unclear whether or not specialized hardware will provide an advantage for general cases.  Google has created the TPU.  Either it or something like it will eventually be available on the market.  At that time, will these eventually sunset GPUs for use in deep learning?";
    const deadline = new Date('2017,03,01, 07, 00, 00');

    const rfc = {topic, description, deadline};

    return res.send(rfc);
});

module.exports = router;