const router = require('express').Router();

const adminAuth = require('../middlewares/auth-admin');

const { getUsers, getAllUsers, getUser, updateUser, deleteUser, getMe } = require('../contollers');

router.get('/', getUsers);

router.get('/all', adminAuth, getAllUsers);

router.get('/me', getMe);

router.route('/:user_id')
  .all(adminAuth)
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
