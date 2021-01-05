const router = require('express').Router();

const {
  getAll, getOne, create, update, deleteOne, deleteAll,
} = require('../contollers').reservations;

router
  .get('/', getAll)
  .get('/:reservation_id', getOne)
  .post('/', create)
  .put('/:reservation_id', update)
  .delete('/:reservation_id', deleteOne)
  .delete('/', deleteAll);

module.exports = router;
