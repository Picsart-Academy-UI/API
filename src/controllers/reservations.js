const { Reservation } = require('booking-db');

const { NotFound } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

const {
  buildQuery,
  getPagination,
} = require('../utils/util');

const {
  findOneReservation,
  deleteOneReservation
} = require('../utils/reservation-helpers');

const {
  updateReservation,
  createReservation
} = require('../utils/reservation-helpers');


// @desc  create reservation
// @route POST => /api/v1/reservations
// @access Private (User/Admin)
exports.create = asyncHandler(async (req, res) => {
  const reservation = await createReservation(req);
  return res.status(201).json({data: reservation});
});


// @desc  update reservation
// @route PUT => /api/v1/reservations/:reservation_id
// @access Private (User/Admin)
exports.update = asyncHandler(async (req, res) => {
  const reservation = await updateReservation(req);
  return res.status(202).json({
    data: reservation
  });
});


// @desc  get reservations
// @route GET => /api/v1/reservations
// @access Private (Admin)
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

exports.getOne = asyncHandler(async (req, res, next) => {
  const reservation = await findOneReservation(req);

  if (!reservation) next(new NotFound());

  return res.status(200).json({ data: reservation });
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const reservation = await deleteOneReservation(req);

  if (!reservation) next(new NotFound());

  return res.status(200).json({
    message: 'Reservation was deleted.',
  });
});
