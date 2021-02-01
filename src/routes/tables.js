const router = require('express').Router();
const adminAuth = require('../middlewares/auth-admin');

const {
  create, getAll, getTables, getOne, update, deleteOne
} = require('../controllers').tables;

router
  .post('/', adminAuth, create)
  .get('/all', adminAuth, getAll)
  .get('/', getTables)
  .get('/:table_id', adminAuth, getOne)
  .put('/:table_id', adminAuth, update)
  .delete('/:table_id', adminAuth, deleteOne);

module.exports = router;
