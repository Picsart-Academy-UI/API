const router = require('express').Router();

const { notifications } = require('../contollers');

const { subscribe, another_one } = notifications;

router.post('/subscribe', subscribe);
router.post('/anotherOne', another_one);

module.exports = router;
