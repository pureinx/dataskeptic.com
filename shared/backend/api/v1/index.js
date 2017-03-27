const express = require('express');

const apiRouter = express.Router();

apiRouter.use('/slack', require('./slack'));
apiRouter.use('/email', require('./email'));
apiRouter.use('/invoice', require('./invoices'));
apiRouter.use('/order', require('./orders'));
apiRouter.use('/contributors', require('./contributors'));
apiRouter.use('/related', require('./related'));
apiRouter.use('/blog', require('./blogs'));
apiRouter.use('/store', require('./store'));
apiRouter.use('/rfc', require('./rfc'));

module.exports = apiRouter;