const {Reservation} = require('booking-db');

const {asyncHandler} = require('../middlewares/asyncHandler');
const {ErrorResponse, NotFound} = require('../utils/errorResponse');

const {
  buildQuery,
  getPagination,
} = require('../utils/util');

const {
  formatDateAndGiveQuery,
  updateReservation,
  createReservation} = require('../utils/reservation-helpers');

exports.create = asyncHandler(async (req, res) => {

  const {today, foundReservations, reservation} = formatDateAndGiveQuery(req);

  const found = await foundReservations.lean().exec();

  if (found.length !== 0) {
    throw new ErrorResponse('Conflict with the reservation period', 400);
  }
  const reserved = await createReservation(reservation, today);

  return res.status(201)
    .json({data: reserved});
});

exports.update = asyncHandler(async (req, res) => {

  const {reservation_id} = req.params;

  const requestedReservation = await Reservation.findById(reservation_id);

  if (!requestedReservation) {
    throw new NotFound(`The reservation with id ${reservation_id} was not found`);
  }

  if (!req.user.is_admin && req.user._id.toString() !== requestedReservation.user_id.toString()) {
    throw new ErrorResponse('Not authorized to modify this entity', 401);
  }

  const {today, foundReservations, reservation} = formatDateAndGiveQuery(req);

  const found = await foundReservations.lean().exec();

  const updatedReservation = await updateReservation(reservation, found,
    requestedReservation, reservation_id, today, req);

  if (!updatedReservation) {
    throw new ErrorResponse('Conflict with the reservation period');
  }

  return res.status(202).json({
    data: updatedReservation
  });

});

exports.getAll = asyncHandler(async (req, res) => {

  const queryObject = buildQuery(req.query);

  const initialQuery = Reservation.find(queryObject);

  const count = await Reservation.countDocuments(queryObject);

  const { pagination, query } = getPagination(
    req.query.page, req.query.limit, count, req, initialQuery
  );

  const reservations = await query.lean().exec();

  return res.status(200).json({data: reservations, count, pagination});

});

exports.getOne = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.reservation_id);
  if (!reservation) {
    throw new ErrorResponse(`Reservation not found with id of ${req.params.reservation_id}`, 404);
  }
  if (reservation.user_id.toString() !== req.user._id.toString() && !req.user.is_admin) {
    throw new ErrorResponse('Not authorized', 401);
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
