const router = require('express').Router();

const { signin, invite } = require('../contollers/index');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

router.post('/auth/signin',signin);
router.post('/auth/invite', authenticate, authenticateAdmin, invite);


module.exports = router;
