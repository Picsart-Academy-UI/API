const router = require('express').Router();

const { invite } = require('../contollers');

router.post('/invite', invite);

module.exports = router;
