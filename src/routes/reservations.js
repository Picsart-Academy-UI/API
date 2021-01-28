const router = require('express').Router();

const adminAuth = require('../middlewares/auth-admin');

// const checkReservation = require('../middlewares/check-reservation');

const {
  getAll, getOne, create, update, deleteOne,
} = require('../controllers').reservations;

router
  .get('/', adminAuth, getAll)
  .get('/:reservation_id', getOne)
  .post('/', create)
  .put('/:reservation_id', update)
  .delete('/:reservation_id', deleteOne);

module.exports = router;
