const router = require('express').Router();

const { notifications } = require('../controllers');

const { subscribe } = notifications;
const { another_one} = notifications;
const authenticate = require('../middlewares/auth');

router.post('/subscribe', authenticate, subscribe);
router.post('/anotherOne', authenticate, another_one);

module.exports = router;
