const express = require('express');

const router = express.Router();

const { signIn } = require('../contollers');

router.post('/signin', signIn);

module.exports = router;
