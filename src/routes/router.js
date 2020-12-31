const express = require('express');

const router = express.Router();

const signInRouter = require('./sign-in');

const inviteRouter = require('./invite');

const teamRouter = require('./teams');

const chairRouter = require('./chairs');

const tableRouter = require('./tables');

const positionRouter = require('./positions');

const reservationRouter = require('./reservations');

const usersRouter = require('./users');

const errorHandler = require('../middlewares/error');

router.use('/auth', signInRouter);

router.use('/auth', inviteRouter);

router.use('/teams', teamRouter);

router.use('/chairs', chairRouter);

router.use('/tables', tableRouter);

router.use('/positions', positionRouter);

router.use('/reservations', reservationRouter);

router.use('/users', usersRouter);

module.exports = router;
