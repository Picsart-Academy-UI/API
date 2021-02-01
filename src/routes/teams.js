const router = require('express').Router();
const adminAuth = require('../middlewares/auth-admin');

const {
  create, getAll, getOne, update, deleteOne, search
} = require('../controllers').teams;

router.get('/search', search);

router
  .post('/', adminAuth, create)
  .get('/', adminAuth, getAll)
  .get('/:team_id', adminAuth, getOne)
  .put('/:team_id', adminAuth, update)
  .delete('/:team_id', adminAuth, deleteOne);

module.exports = router;
