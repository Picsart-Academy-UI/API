const express = require('express');

const router = express.Router();

const signInRouter = require('./sign-in');

const inviteRouter = require('./invite');

const verifyRouter = require('./verify');

router.use('/auth', signInRouter);

router.use('/auth', inviteRouter);

router.use('/auth', verifyRouter);

module.exports = router;
