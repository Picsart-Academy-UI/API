const router = require('express').Router();
const {
  create, getAll, getOne, update, deleteOne, deleteAll
} = require('../contollers').positions;

router
  .post('/', create)
  .get('/', getAll)
  .get('/:position_id', getOne)
  .put('/:position_id', update)
  .delete('/:position_id', deleteOne)
  .delete('/', deleteAll);

module.exports = router;
