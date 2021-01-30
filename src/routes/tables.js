const router = require('express').Router();
const {
  create, getAll, getOne, update, deleteOne
} = require('../controllers').tables;

router
  .post('/', create)
  .get('/', getAll)
  .get('/:table_id', getOne)
  .put('/:table_id', update)
  .delete('/:table_id', deleteOne);

module.exports = router;
