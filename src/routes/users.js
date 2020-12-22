const router = require('express').Router();
const {users} = require('../contollers');

router.get('/', users);

module.exports = router;
