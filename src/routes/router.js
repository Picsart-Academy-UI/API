const express = require('express');

const router = express.Router();

const signInRouter = require('./sign-in');

const inviteRouter = require('./invite');

const verifyRouter = require('./verify');

const teamRouter = require('./team');

const reservationRouter = require('./reservation');

router.use('/auth', signInRouter);

router.use('/auth', inviteRouter);

router.use('/auth', verifyRouter);

router.use('/teams', teamRouter);

router.use('/reservation', reservationRouter);

module.exports = router;
