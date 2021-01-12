const router = require('express').Router();

<<<<<<< HEAD
const adminAuth = require('../middlewares/auth-admin');
=======
// const checkReservation = require('../middlewares/check-reservation');
>>>>>>> 053b14cce05cfdc5d0a016bb6d9fbeb31aa8609b

const {
  getAll, getOne, create, update, deleteOne,
} = require('../contollers').reservations;

router
  .get('/', adminAuth, getAll)
  .get('/:reservation_id', getOne)
  .post('/', create)
  .put('/:reservation_id', update)
  .delete('/:reservation_id', deleteOne);

module.exports = router;
