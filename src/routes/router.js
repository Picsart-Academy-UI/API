const express = require('express');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

const router = express.Router();

<<<<<<< HEAD
const teamRouter = require('./teams');

const chairRouter = require('./chairs');

const tableRouter = require('./tables');

const positionRouter = require('./positions');

const reservationRouter = require('./reservations');

=======
const authRouter = require('./auth');
const teamRouter = require('./team');
const reservationRouter = require('./reservation');
>>>>>>> 002303859f8e5badf4065e398ace72d2adb64c0b
const usersRouter = require('./users');
const notificationsRouter = require('./notifications');

<<<<<<< HEAD
const errorHandler = require('../middlewares/error');

router.use('/auth', signInRouter);
=======
router.use(authRouter);
>>>>>>> 002303859f8e5badf4065e398ace72d2adb64c0b

router.use('/teams', authenticate, teamRouter);

router.use('/reservation', authenticate, reservationRouter);

<<<<<<< HEAD
router.use('/chairs', chairRouter);

router.use('/tables', tableRouter);

router.use('/positions', positionRouter);

router.use('/reservations', reservationRouter);
=======
router.use('/users', authenticate, usersRouter);
>>>>>>> 002303859f8e5badf4065e398ace72d2adb64c0b

router.use('/notifications', notificationsRouter);

module.exports = router;
