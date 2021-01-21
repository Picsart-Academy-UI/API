const router = require('express').Router();
const {
  create, getAll, getOne, update, deleteOne, deleteAll
} = require('../controllers').chairs;

router
  .post('/', create)
  .get('/', getAll)
  .get('/:chair_id', getOne)
  .put('/:chair_id', update)
  .delete('/:chair_id', deleteOne);

module.exports = router;
