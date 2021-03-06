const router = require('express').Router();

const adminAuth = require('../middlewares/auth-admin');

const authenticate = require('../middlewares/auth');

const {
  getAll, getOne, create, update, deleteOne, seeLoad
} = require('../controllers').reservations;

router.use(authenticate)
  .get('/', getAll)
  .get('/seeload', adminAuth, seeLoad)
  .get('/:reservation_id', getOne)
  .post('/', create)
  .put('/:reservation_id', adminAuth, update)
  .delete('/:reservation_id', deleteOne);

module.exports = router;
