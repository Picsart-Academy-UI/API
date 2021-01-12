const router = require('express').Router();

const { notifications } = require('../contollers');

const { subscribe } = notifications;
const { another_one} = notifications;
const authenticate = require('../middlewares/auth');

<<<<<<< HEAD
router.post('/subscribe', subscribe);
router.post('/anotherOne', another_one);
=======
router.post('/subscribe', authenticate, subscribe);
router.post('/anotherOne', authenticate, another_one);
>>>>>>> 053b14cce05cfdc5d0a016bb6d9fbeb31aa8609b

module.exports = router;
