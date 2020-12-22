const router = require('express').Router();
const { verify } = require('../contollers');

router.post('/verify', verify);

module.exports = router;
