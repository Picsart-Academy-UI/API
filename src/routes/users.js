const router = require('express').Router();

const {
  getUsers, getAllUsers, getUser, updateUser, deleteUser, getMe
} = require('../contollers');

router.get('/', getUsers);

router.get('/all', getAllUsers);

router.get('/:user_id', getUser)
  .put('/:user_id', updateUser)
  .delete('/:user_id', deleteUser);

router.get('/me', getMe);

module.exports = router;
