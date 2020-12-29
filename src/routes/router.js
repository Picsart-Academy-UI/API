const express = require('express');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

const router = express.Router();

const authRouter = require('./auth');
const teamRouter = require('./team');
const reservationRouter = require('./reservation');
const usersRouter = require('./users');

router.use(authRouter);

router.use('/teams', authenticate, teamRouter);

router.use('/reservation', authenticate, reservationRouter);

router.use('/users', authenticate, usersRouter);

module.exports = router;
