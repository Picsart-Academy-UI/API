const router = require('express').Router();
const { team } = require('../contollers');

router
  .post('/', team.create)
  .get('/', team.getAll)
  .get('/:team_id', team.getById)
  .put('/:team_id', team.update)
  .delete('/:team_id', team.delete);

module.exports = router;
