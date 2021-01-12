const moment = require('moment-timezone');

const { Reservation } = require('booking-db');

const { asyncHandler } = require('../middlewares/asyncHandler');

const { ErrorResponse, Conflict } = require('../utils/errorResponse');

const { fragmentation } = require('../utils/reservationFragmentation');

exports.create = asyncHandler(async (req, res, next) => {
  const { start_date, end_date, table_id, chair_id, team_id, user_id } = req.body;

  const start = moment(start_date);
  const end = moment(end_date);
  const momentDate = moment();
  const founded = await Reservation.find({
    //                  1             10
    start_date: {$gte: start, $lte: end},
    end_date: {$gte: start, $lte: end},
    chair_id
  }).sort('rating');
  console.log(founded);

  if (founded.length !== 0) {
    return next(new Conflict('Conflict with the reservation period.'));
  }

  // if (
  //   start.month() === momentDate.month()
  //   && start.date() === momentDate.date()
  // ) {
  //   fragmentation();
  // }

  const reservation = await Reservation.create(req.body);
  return res.status(201).json({data: reservation});
});

exports.update = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findOneAndUpdate(
    { _id: req.params.reservation_id },
    { $set: req.body },
    { new: true },
    { runValidators: true }
  );
  if (!reservation) {
    return next(new ErrorResponse(
      `Reservation not found with id of ${req.params.reservation_id}`,
      404
    ));
  }
  return res.status(200).json({data: reservation});
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const reservations = await Reservation.find();
  return res.status(200).json({data: reservations});
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.reservation_id);
  if (!reservation) {
    return next(new ErrorResponse(
      `Reservation not found with id of ${req.params.reservation_id}`,
      404
    ));
  }
  return res.status(200).json({data: reservation});
});

exports.deleteAll = asyncHandler(async (req, res, next) => {
  await Reservation.deleteMany();
  return res.status(200).json({
    message: 'All reservations were deleted',
  });
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.reservation_id);
  if (!reservation) {
    return next(new ErrorResponse(
      `Reservation not found with id of ${req.params.reservation_id}`,
      404
    ));
  }
  await Reservation.deleteOne({ _id: req.params.reservation_id });
  return res.status(200).json({
    message: 'Reservation was deleted',
  });
});
