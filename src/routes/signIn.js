const express = require('express');

const router = express.Router();
const { signIn } = require('../contollers');

router.post('/signIn', signIn);

module.exports = router;
