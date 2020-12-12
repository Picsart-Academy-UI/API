const express = require('express');

const router = express.Router();

const signInRouter = require('./sign-in');

router.use('/auth', signInRouter);

module.exports = router;
