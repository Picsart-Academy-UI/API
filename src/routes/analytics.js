const router = require('express').Router();

const authenticate = require('../middlewares/auth');

const {
  analytics
} = require('../controllers');

router.use(authenticate)
  .get('/day', analytics.getAnalyticsForDay)
  .get('/week', analytics.getAnalyticsForWeek)
  .get('/month', analytics.getAnalyticsForMonth);

module.exports = router;
