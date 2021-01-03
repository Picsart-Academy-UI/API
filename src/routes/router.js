const express = require('express');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

const router = express.Router();

const authRouter = require('./auth');

const teamRouter = require('./teams');

const usersRouter = require('./users');

const chairRouter = require('./chairs');

const tableRouter = require('./tables');

const positionRouter = require('./positions');

const reservationRouter = require('./reservations');

const notificationsRouter = require('./notifications');

router.use(authRouter);

router.use('/teams', authenticate, teamRouter);

router.use('/chairs', chairRouter);

router.use('/tables', tableRouter);

router.use('/positions', positionRouter);

router.use('/reservations', reservationRouter);

router.use('/users', authenticate, usersRouter);

router.use('/notifications', notificationsRouter);

module.exports = router;
