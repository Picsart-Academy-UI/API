const {Reservation} = require('booking-db');

const {asyncHandler} = require('../middlewares/asyncHandler');
const {NotFound, Unauthorized, Conflict} = require('../utils/errorResponse');

const {
  buildQuery,
  getPagination,
} = require('../utils/util');

const {
  formatDateAndGiveQuery,
  updateReservation,
  createReservation
} = require('../utils/reservation-helpers');

exports.create = asyncHandler(async (req, res) => {

  const {today, foundReservations, reservation} = formatDateAndGiveQuery(req);

  const found = await foundReservations.lean().exec();

  if (found.length !== 0) {
    throw new Conflict('Conflict with the reservation period');
  }
  const reserved = await createReservation(reservation, today);

  return res.status(201)
    .json({data: reserved});
});

exports.update = asyncHandler(async (req, res) => {

  const {reservation_id} = req.params;

  const requestedReservation = await Reservation.findById(reservation_id);

  if (!requestedReservation) {
    throw new NotFound();
  }

  if (!req.user.is_admin && req.user._id.toString() !== requestedReservation.user_id.toString()) {
    throw new Unauthorized('Not authorized to modify this entity');
  }

  const {today, foundReservations, reservation} = formatDateAndGiveQuery(req);

  const found = await foundReservations.lean().exec();

  const updatedReservation = await updateReservation(reservation, found,
    requestedReservation, reservation_id, today, req);

  if (!updatedReservation) {
    throw new Conflict('Conflict with the reservation period');
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
    throw new NotFound();
  }
  if (reservation.user_id.toString() !== req.user._id.toString() && !req.user.is_admin) {
    throw new Unauthorized('Not authorized');
  }
  return res.status(200)
    .json({data: reservation});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.reservation_id);
  if (!reservation) {
    return next(new NotFound());
  }
  await Reservation.deleteOne({_id: req.params.reservation_id});
  return res.status(200)
    .json({
      message: 'Reservation was deleted',
    });
});
