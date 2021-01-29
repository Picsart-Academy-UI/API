const {Reservation} = require('booking-db');


const {NotFound} = require('../utils/errorResponse');
const {asyncHandler} = require('../middlewares/asyncHandler');

const {
    buildQuery,
    getPagination,
} = require('../utils/util');

const {
    findOneReservation,
    deleteOneReservation,
    seeLoadReservations
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
    let initialQuery;
    let queryObject = buildQuery(req.query);
    if (!req.user.is_admin) queryObject = {...queryObject, team_id: req.user.team_id};
    if (req.query.include_usersAndChairs) {
        initialQuery = Reservation.find(queryObject).populate({
            path: 'user_id',
            select: 'first_name last_name is_admin email position profile_picture position'})
            .populate({path: 'chair_id', select: 'number'});
    } else {
        initialQuery = Reservation.find(queryObject);
    }
    const count = await Reservation.countDocuments(queryObject);

    const {pagination, query} = getPagination(
        req.query.page, req.query.limit, count, req, initialQuery
    );

    const reservations = await query.lean().exec();

    return res.status(200).json({data: reservations, count, pagination});
});

// @desc  get reservation
// @route GET => /api/v1/reservations/reservation_id
// @access Private (Admin/User)

exports.getOne = asyncHandler(async (req, res, next) => {
    const reservation = await findOneReservation(req);

    if (!reservation) next(new NotFound());

    return res.status(200).json({data: reservation});
});
// @desc  delete reservation
// @route GET => /api/v1/reservations/reservation_id
// @access Private (Admin/User)

exports.deleteOne = asyncHandler(async (req, res, next) => {
    const reservation = await deleteOneReservation(req);

    if (!reservation) throw new NotFound('Reservation was not found');

    return res.status(200).json({
        message: 'Reservation was deleted.',
    });
});


// @desc  get approved reservations count for specified team_id
// @route GET => /api/v1/reservations/seeload
// @access Private (Admin/User)

exports.seeLoad = asyncHandler(async (req, res, next) => {
    const result = await seeLoadReservations(req);
    return res.status(200).json({
        data: result
    });
});



