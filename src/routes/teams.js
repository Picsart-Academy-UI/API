const router = require('express').Router();
const {
  create, getAll, getOne, update, deleteOne, deleteAll
} = require('../contollers').teams;

router
  .post('/', create)
  .get('/', getAll)
  .get('/:team_id', getOne)
  .put('/:team_id', update)
  .delete('/:team_id', deleteOne)
  .delete('/', deleteAll);

module.exports = router;
