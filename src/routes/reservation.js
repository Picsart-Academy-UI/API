const router = require('express').Router();
const { reservation } = require('../contollers');

const {
  get, getOne, create, update, deleteOne, deleteAll,
} = reservation;

router
  .get('/', get)
  .get('/:reservation_id', getOne)
  .post('/', create)
  .put('/:reservation_id', update)
  .delete('/:reservation_id', deleteOne)
  .delete('/:reservation_id', deleteAll);

module.exports = router;
