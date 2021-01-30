const router = require('express').Router();

const { notifications } = require('../controllers');

const { subscribe } = notifications;
const authenticate = require('../middlewares/auth');

router.post('/subscribe', authenticate, subscribe);

module.exports = router;
