const moment = require('moment-timezone');
const { Reservation } = require('booking-db');

const { asyncHandler } = require('../middlewares/asyncHandler');

// eslint-disable-next-line no-shadow
exports.reserve = asyncHandler(async (req, res, next) => {

  const { start_date, end_date, table_id, chair_id, team_id, user_id } = req.body;

  const startDate = moment(start_date).tz('Asia/Yerevan');

  const reserve_1 = await Reservation.create({
    date_start: startDate,
    date_end: startDate,
    status: 'Approved',
    table_id,
    chair_id,
    team_id,
    user_id
  });

  const reserve_2 = await Reservation.create({
    start_date: startDate.add(1, 'day'),
    end_date,
    status: 'Pending',
    table_id,
    chair_id,
    team_id,
    user_id
  });
  console.log([reserve_1, reserve_2]);
  console.log('Reservation approved for today and next days pending');

  return res.status(200).json({
    data: [reserve_1, reserve_2]
  });

});
