const express = require('express');

const router = express.Router();

const signInRouter = require('./signIn');

router.use('/auth', signInRouter);

module.exports = router;
