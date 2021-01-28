const router = require('express').Router();

const { signin, invite, logout } = require('../controllers');

const authenticate = require('../middlewares/auth');
const authenticateAdmin = require('../middlewares/auth-admin');

router.post('/auth/signin', signin);
router.post('/auth/invite', authenticate, authenticateAdmin, invite);
router.post('/auth/logout', authenticate, logout);

module.exports = router;
