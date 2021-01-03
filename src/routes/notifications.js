const router = require('express').Router();

const { notifications } = require('../contollers');

const { subscribe } = notifications;

router.post('/subscribe/:user_id', subscribe);

module.exports = router;
