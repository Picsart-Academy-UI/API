const express = require('express');

const router = express.Router();

const signInRouter = require('./sign-in');

const inviteRouter = require('./invite');

router.use('/auth', signInRouter);

router.use('/auth', inviteRouter);

module.exports = router;
