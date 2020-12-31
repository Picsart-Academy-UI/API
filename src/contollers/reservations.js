const { Reservation } = require('booking-db');
const filter_queries = require('../utils/filter-queries');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
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
  const queries = filter_queries(req.query);
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
