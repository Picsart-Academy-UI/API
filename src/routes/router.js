const express = require('express');

const router = express.Router();

const signInRouter = require('./sign-in');

const inviteRouter = require('./invite');

const teamRouter = require('./team');

const reservationRouter = require('./reservation');

const usersRouter = require('./users');

const notificationsRouter = require('./notifications');

router.use('/auth', signInRouter);

router.use('/auth', inviteRouter);

router.use('/teams', teamRouter);

router.use('/reservation', reservationRouter);

router.use('/users', usersRouter);

router.use('/notifications', notificationsRouter);

module.exports = router;
