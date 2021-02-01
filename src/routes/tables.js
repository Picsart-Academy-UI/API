const router = require('express').Router();
const adminAuth = require('../middlewares/auth-admin');

const {
  create, getAll, getTables, getOne, update, deleteOne
} = require('../controllers').tables;

router
  .post('/',create)
  .get('/all', getAll)
  .get('/', getTables)
  .get('/:table_id', getOne)
  .put('/:table_id', update)
  .delete('/:table_id', deleteOne);

module.exports = router;
