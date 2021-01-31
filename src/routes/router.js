const router = require('express').Router();

const authRouter = require('./auth');

const teamsRouter = require('./teams');

const usersRouter = require('./users');

const tablesRouter = require('./tables');

const reservationsRouter = require('./reservations');

const notificationsRouter = require('./notifications');

const authenticate = require('../middlewares/auth');

router.use(authRouter);

router.use('/teams', teamsRouter);

router.use('/tables', tablesRouter);

router.use('/reservations', reservationsRouter);

router.use('/users', authenticate, usersRouter);

router.use('/notifications', authenticate, notificationsRouter);

module.exports = router;
