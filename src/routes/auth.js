const router = require('express').Router();

const { signin, invite, logout } = require('../contollers');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

router.post('/auth/signin', signin);
router.post('/auth/invite', authenticate, authenticateAdmin, invite);
router.post('/auth/logout/:user_id', logout);

module.exports = router;
