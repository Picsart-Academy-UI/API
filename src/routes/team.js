const router = require('express').Router();
const { team } = require('../contollers');

router
  .post('/', team.create)
  .get('/', team.getAll)
  .get('/:team_id', team.getOne)
  .put('/:team_id', team.update)
  .delete('/:team_id', team.deleteOne)
  .delete('/:team_id', team.deleteAll);

module.exports = router;
