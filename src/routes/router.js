const express = require('express');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

const router = express.Router();

const authRouter = require('./auth');
const teamRouter = require('./team');
const reservationRouter = require('./reservation');
const usersRouter = require('./users');
const notificationsRouter = require('./notifications');

router.use(authRouter);

router.use('/teams', authenticate, teamRouter);

router.use('/reservation', authenticate, reservationRouter);

router.use('/users', authenticate, usersRouter);

router.use('/notifications', notificationsRouter);

module.exports = router;
