const router = require('express').Router();

const adminAuth = require('../middlewares/auth-admin');

const {
  getUsers, getAllUsers, getUser, updateUser, deleteUser, getMe, search
} = require('../controllers').users;

router.get('/', getUsers);
router.get('/all', adminAuth, getAllUsers);
router.get('/me', getMe);
router.get('/search', search);

router.route('/:user_id')
  .all(adminAuth)
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
