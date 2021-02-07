const moment = require('moment-timezone');
const { Reservation } = require('booking-db');

const moment1 = require('moment');

const { BadRequest } = require('./errorResponse');

const format = 'YYYY-MM-DD';

const getToday = () => moment().tz('Asia/Yerevan').format(format);

const addOneDay = (date) => moment(date).add(1, 'day').format(format);

const getPlainReservation = (reservation) => {
  const {
    user_id, team_id,
    start_date, end_date,
    table_id, chair_id, status
  } = reservation;
  let start; let
    end;
  if (start_date) {
    start = moment(start_date).format(format);
  }
  if (end_date) {
    end = moment(end_date).format(format);
  }
  // building the reservation
  return {
    start_date: start,
    end_date: end,
    user_id,
    team_id,
    table_id,
    chair_id,
    status
  };
};

// Create Reservation
const createReservation = async (req) => {
  if (req.user.is_admin) {
    req.body.status = 'approved';
    req.body.user_id = req.body.user_id || req.user._id;
  } else {
    req.body.status = 'pending';
    req.body.team_id = req.user.team_id;
    req.body.user_id = req.user._id;
  }
  const plainReservation = getPlainReservation(req.body);
  try {
    const reservation = await Reservation.create(plainReservation);
    return reservation;
  } catch (err) {
    if (err.message === 'Reservation was split') {
      return err.payload;
    }
    throw err;
  }
};

// Update Reservation;
const updateReservation = async (req, next) => {
  const { reservation_id } = req.params;
  const { status } = req.body;
  return Reservation
    .findOneAndUpdate(
      { _id: reservation_id, status: 'pending' },
      { status },
      { new: true }
    ).lean().exec();
};

const findOneReservation = (req) => {
  if (req.user.is_admin) {
    return Reservation.findById(req.params.reservation_id);
  }
  return Reservation.findOne({ _id: req.params.reservation_id, team_id: req.user.team_id });
};

const deleteOneReservation = (req) => Reservation.findOneAndDelete({
  user_id: req.user._id,
  _id: req.params.reservation_id,
  $or: [{ status: 'pending' }, { status: 'approved' }]
});

const getTodayReservations = () => {
  const today = getToday();
  return Reservation.find({ start_date: today, status: 'pending' }).lean().exec();
};

const getFormattedDate = (date) => moment(date).format(format);

const seeLoadReservations = async (req, next) => {
  const { start_date, end_date, team_id } = req.query;
  const a = moment1(start_date);
  const b = moment1(end_date);

  if (a > b) return next(new BadRequest('Start date cannot be bigger than end date '));
  const diff = b.diff(a, 'days') + 1;
  if (diff > 32) return next(new BadRequest('Max range is 31 days'));
  const results = await Reservation.find({
    $and: [
      { end_date: { $gte: new Date(start_date) } },
      { start_date: { $lte: new Date(end_date) } }
    ],
    team_id,
    status: 'approved'
  }).select('start_date end_date').lean().exec();

  const arr = [];
  // eslint-disable-next-line no-plusplus
  let acc = moment(start_date);
  for (let i = 0; i < diff; i++) {
    const start = acc.format(format);
    const count = results.filter((item) => {
      const momentStart = moment(item.start_date).format(format);
      const momentEnd = moment(item.end_date).format(format);
      return start >= momentStart && momentEnd >= start;
    }).length;
    arr.push({ [start]: count });
    acc = acc.add(1, 'day');
  }
  return arr;
};

module.exports = {
  getToday,
  addOneDay,
  getPlainReservation,
  createReservation,
  updateReservation,
  findOneReservation,
  deleteOneReservation,
  getTodayReservations,
  getFormattedDate,
  seeLoadReservations
};
