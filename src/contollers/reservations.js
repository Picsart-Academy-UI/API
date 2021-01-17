const {Reservation, User} = require('booking-db');

const {asyncHandler} = require('../middlewares/asyncHandler');
const {ErrorResponse} = require('../utils/errorResponse');
const { reservationNotification } = require('../utils/generateNotifications');
const {findOneReservation, deleteOneReservation} = require('../utils/reservation-helpers');


const {
  buildQuery,
  getPagination,
} = require('../utils/util');

const {
  updateReservation,
  createReservation} = require('../utils/reservation-helpers');

exports.create = asyncHandler(async (req, res) => {
  const reservation = await createReservation(req);
  const { user_id, start_date, end_date } = reservation;

  const user = await User.findById(user_id);
  const { push_subscriptions } = user;

  if (reservation.status === 'approved') {
    reservationNotification('approved', reservation, push_subscriptions);
  }

  return res.status(201)
    .json({data: reservation});
});

exports.update = asyncHandler(async (req, res) => {
  const reservation = await updateReservation(req);
  const { user_id } = reservation;

  const user = await User.findById(user_id);
  const { push_subscriptions } = user;

  reservationNotification('updated', reservation, push_subscriptions);

  return res.status(202).json({
    data: reservation
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
  const reservation = await findOneReservation(req);
  if (!reservation) {
    throw new ErrorResponse(`Reservation not found with id of ${req.params.reservation_id}`, 404);
  }
  return res.status(200)
    .json({data: reservation});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const reservation = await deleteOneReservation(req);
  if (!reservation) {
    return next(new ErrorResponse(
      `Reservation not found with id of ${req.params.reservation_id}`,
      404
    ));
  }
  return res.status(200)
    .json({
      message: 'Reservation was deleted',
    });
});
