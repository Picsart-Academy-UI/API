const moment = require('moment-timezone');

const { Reservation } = require('booking-db');

const { Conflict } = require('../utils/errorResponse');

const { asyncHandler } = require('./asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {

  const { start_date, end_date, table_id, chair_id, team_id, user_id } = req.body;

  const start = moment(start_date);
  const end = moment(end_date);

  const founded = Reservation.find({
    start_date: {$gte: start, $lte: end},
    end_date: {$gte: start, $lte: end},
    chair_id
  }).sort('rating');

  if (founded.length !== 0) {
    return next(new Conflict('Conflict with the reservation period.'));
  }
  return next();
});
