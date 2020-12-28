const router = require('express').Router();

const { getUsers, getAllUsers, getUser, updateUser, deleteUser, getMe } = require('../contollers');

router.get('/', getUsers);

router.get('/all', getAllUsers);

router.get('/me', getMe);

router.route('/:user_id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
