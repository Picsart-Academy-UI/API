const moment = require('moment-timezone');
const { Reservation } = require('booking-db');
const {ErrorResponse} = require('./errorResponse');

const format = 'YYYY-MM-DD';

const getToday = () => {
  return moment().tz('Asia/Yerevan').format(format);
};

const checkReservationDates = (reservation) => {
  const {start_date, end_date} = reservation;
  const today = getToday();
  return start_date >= today && end_date >= today && end_date >= start_date;
};

const attachMissingFields = (reservation, foundReservation) => {
  return {
    start_date: reservation.start_date || foundReservation.start_date,
    end_date: reservation.end_date || foundReservation.end_date,
    table_id: reservation.table_id || foundReservation.table_id,
    chair_id: reservation.chair_id || foundReservation.chair_id,
    team_id: reservation.team_id || foundReservation.team_id,
    user_id: reservation.user_id || foundReservation.user_id,
    status: reservation.status || foundReservation.status
  };
};

const getPlainReservation = (req) => {
  const {start_date, end_date, table_id, chair_id, team_id} = req.body;
  const status = req.user.is_admin ? req.body.status : 'pending';
  const user_id = req.user.is_admin ? req.body.user_id : req.user._id;
  // building correct formats
  const start = moment(start_date).format(format);
  const end = moment(end_date).format(format);
  // building the reservation
  return {
    start_date: start,
    end_date: end,
    table_id,
    chair_id,
    team_id,
    user_id,
    status
  };
};

const getConflictingReservations = (reservation) => {
  const {start_date, end_date, chair_id} = reservation;
  return Reservation.find({

    $or: [
      {
        start_date: {$lte: start_date},
        end_date: {$gte: start_date},
      },
      {
        start_date: {$gte: start_date},
        end_date: {$lte: end_date},
      },
      {
        start_date: {
          $eq: end_date
        }
      }
    ],
    chair_id
  }).sort('rating');
};
// eslint-disable-next-line no-shadow
const divideReservation = (reservation) => {

  const { start_date, end_date, table_id, chair_id, team_id, user_id, status } = reservation;

  const reserve_1 = new Reservation({
    start_date,
    end_date: start_date,
    status: 'approved',
    table_id,
    chair_id,
    team_id,
    user_id
  });

  const reserve_2 = new Reservation({
    start_date: moment(start_date).add(1, 'day').format(format),
    end_date,
    table_id,
    chair_id,
    status,
    team_id,
    user_id
  });

  return [reserve_1, reserve_2];

};

// Create Reservation

exports.createReservation = async (req) => {
  const plainReservation = getPlainReservation(req);
  if (!checkReservationDates(plainReservation)) {
    throw new ErrorResponse('Reservations should have appropriate dates', 400);
  }
  const today = getToday();
  const conflictingReservations = await getConflictingReservations(plainReservation);
  if (conflictingReservations.length !== 0) {
    throw new ErrorResponse('Conflict with the reservation period', 400);
  }
  if (plainReservation.start_date === today && plainReservation.end_date === today) {
    plainReservation.status = 'approved';
    const reservation = await Reservation.create(plainReservation);
    return reservation;
  }
  if (plainReservation.start_date === today) {
    if (req.user.is_admin) {
      if (plainReservation.status === 'approved') {
        const reservation = await Reservation.create(plainReservation);
        return reservation;
      }
    }
    const reservation = await Reservation.create(divideReservation(plainReservation));
    return reservation;
  }

  const reservation = await Reservation.create(plainReservation);
  return reservation;
};

// Update Reservation;

exports.updateReservation = async (req) => {
  let found;
  const {reservation_id} = req.params;
  if (req.user.is_admin) {
    found = await Reservation.findById(reservation_id);
  } else {
    found = await Reservation.findOne({user_id: req.user._id, _id: reservation_id});
  }
  if (!found) {
    throw new ErrorResponse(`The reservation with id ${reservation_id} was not found`, 404);
  }
  if (found.status === 'approved') {
    throw new ErrorResponse('You cannot modify approved reservations');
  }
  const plainReservation = getPlainReservation(req);
  const modifiedReservation = attachMissingFields(plainReservation, found);
  if (!checkReservationDates(modifiedReservation)) {
    throw new ErrorResponse('Reservations should have appropriate dates', 400);
  }
  const today = getToday();
  const conflictingReservations = await getConflictingReservations(modifiedReservation);
  // eslint-disable-next-line max-len

  // eslint-disable-next-line max-len
  if ((conflictingReservations.length === 1 && found._id.toString() === reservation_id) || !found.length) {
    if (modifiedReservation.start_date === today && modifiedReservation.end_date === today) {
      modifiedReservation.status = 'approved';
      // eslint-disable-next-line max-len
      const updated = await Reservation.findByIdAndUpdate(reservation_id, modifiedReservation, {new: true}).lean().exec();
      return updated;
    }
    if (modifiedReservation.start_date === today) {
      console.log(modifiedReservation);
      if (req.user.is_admin) {
        if (modifiedReservation.status === 'approved') {
          // eslint-disable-next-line max-len
          const updated = await Reservation.findByIdAndUpdate(reservation_id, modifiedReservation, {new: true}).lean().exec();
          return updated;
        }
      }
      // eslint-disable-next-line max-len
      await Reservation.findByIdAndDelete(reservation_id).lean().exec();
      const created = await Reservation.create(divideReservation(modifiedReservation));
      return created;
    }
    // eslint-disable-next-line max-len
    const updated = await Reservation.findByIdAndUpdate(reservation_id, modifiedReservation, {new: true}).lean().exec();
    return updated;
  }
  throw new ErrorResponse('Conflict with the reservation period', 400);
};

exports.findOneReservation = (req) => {
  if (req.user.is_admin) {
    return Reservation.findById(req.params.reservation_id);
  }
  return Reservation.findOne({_id: req.params.reservation_id, user_id: req.user._id});
};

exports.deleteOneReservation = (req) => {
  if (req.user.is_admin) {
    return Reservation.findByIdAndDelete(req.params.reservation_id);
  }
  return Reservation.findOneAndDelete({user_id: req.user._id, _id: req.params.reservation_id});
};

exports.getTodayReservations = () => {
  const today = getToday();
  return Reservation.find({start_date: today, status: 'pending'}).lean().exec();
};

exports.getFormattedDate = (date) => {
  return moment(date).format(format);
};

exports.divideReservation = divideReservation;
exports.getToday = getToday;
