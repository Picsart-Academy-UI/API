const router = require('express').Router();
const { get_users, update_user } = require('../contollers');

router.get('/', get_users);

router.put('/', update_user);

module.exports = router;
