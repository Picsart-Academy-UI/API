const router = require('express').Router();

const { notifications } = require('../contollers');

const { subscribe } = notifications;
const { another_one} = notifications;

router.post('/subscribe/:user_id', subscribe);
router.post('/anotherOne/:user_id', another_one);

module.exports = router;
