const {Reservation} = require('booking-db');

const {asyncHandler} = require('../middlewares/asyncHandler');
const {ErrorResponse, Conflict, NotFound} = require('../utils/errorResponse');

const {
  formatDateAndGiveQuery,
  updateReservation,
  createReservation} = require('../utils/reservation-helpers');

exports.create = asyncHandler(async (req, res, next) => {

  const {today, foundReservations, reservation} = formatDateAndGiveQuery(req);

  const found = await foundReservations.lean().exec();

  if (found.length !== 0) {
    return next(new ErrorResponse('Conflict with the reservation period', 400));
  }
  const reserved = await createReservation(reservation, today);

  return res.status(201)
    .json({data: reserved});
});

exports.update = asyncHandler(async (req, res, next) => {

  const {reservation_id} = req.params;

  const requestedReservation = await Reservation.findById(reservation_id);

  if (!requestedReservation) {
    return next(new NotFound(`The reservation with id ${reservation_id} was not found`));
  }

  if (!req.user.is_admin && req.user._id.toString() !== requestedReservation.user_id.toString()) {
    return next(new ErrorResponse('Not authorized to modify this entity', 401));
  }

  const {today, foundReservations, reservation} = formatDateAndGiveQuery(req);

  const found = await foundReservations.lean().exec();

  const updatedReservation = await updateReservation(reservation, found,
    requestedReservation, reservation_id, today, req);

  if (!updatedReservation) {
    return next(new ErrorResponse('Conflict with the reservation period'));
  }

  return res.status(202).json({
    data: updatedReservation
  });

});

exports.getAll = asyncHandler(async (req, res, next) => {
  const reservations = await Reservation.find();
  return res.status(200)
    .json({data: reservations});
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.reservation_id);
  if (!reservation) {
    return next(new ErrorResponse(
      `Reservation not found with id of ${req.params.reservation_id}`,
      404
    ));
  }
  return res.status(200)
    .json({data: reservation});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.reservation_id);
  if (!reservation) {
    return next(new ErrorResponse(
      `Reservation not found with id of ${req.params.reservation_id}`,
      404
    ));
  }
  await Reservation.deleteOne({_id: req.params.reservation_id});
  return res.status(200)
    .json({
      message: 'Reservation was deleted',
    });
});
