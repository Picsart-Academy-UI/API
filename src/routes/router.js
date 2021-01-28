const express = require('express');

const authenticate = require('../middlewares/auth');

const router = express.Router();

const authRouter = require('./auth');

const teamsRouter = require('./teams');

const usersRouter = require('./users');

const chairsRouter = require('./chairs');

const tablesRouter = require('./tables');

const reservationsRouter = require('./reservations');

const notificationsRouter = require('./notifications');

router.use(authRouter);

router.use('/teams', teamsRouter);

router.use('/chairs', chairsRouter);

router.use('/tables', tablesRouter);

router.use('/reservations', reservationsRouter);

router.use('/users', authenticate, usersRouter);

router.use('/notifications', authenticate, notificationsRouter);

module.exports = router;
