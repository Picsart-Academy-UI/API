const router = require('express').Router();

const { notifications } = require('../contollers');

const { subscribe } = notifications;

router.post('/subscribe', subscribe);

module.exports = router;
