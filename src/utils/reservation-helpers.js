const moment = require('moment-timezone');
const { Reservation } = require('booking-db');
const {excludeUndefinedFields} = require('./util');

const format = 'YYYY-MM-DD';

const buildConflictingReservationsQuery = (start, end, chair_id) => Reservation.find({
  $or: [
    {
      start_date: {$lte: start},
      end_date: {$gte: start},
    },
    {
      start_date: {$gte: start},
      end_date: {$lte: end},
    },
    {
      start_date: {
        $eq: end
      }
    }
  ],
  chair_id
}).sort('rating');

exports.formatDateAndGiveQuery = (req) => {
  const {start_date, end_date, table_id, chair_id, team_id} = req.body;
  const status = req.user.is_admin ? req.body.status : 'pending';
  const user_id = req.user.is_admin ? req.body.user_id : req.user._id;
  // building correct formats
  const start = moment(start_date).format(format);
  const end = moment(end_date).format(format);
  const today = moment().format(format);

  // building the reservation

  const reservation = {
    start_date: start,
    end_date: end,
    table_id,
    chair_id,
    team_id,
    user_id,
    status
  };

  // checking to see for overlaping reservations;

  const foundReservations = buildConflictingReservationsQuery(
    start, end, chair_id
  );

  return {
    foundReservations,
    reservation,
    today
  };
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
    start_date: moment(start_date).add(2, 'd'),
    end_date,
    table_id,
    chair_id,
    status,
    team_id,
    user_id
  });

  return [reserve_1, reserve_2];

};
exports.createReservation = (reservation, today) => {
  const reserve = reservation;
  if (reserve.start_date === today && reserve.end_date === today) {
    reserve.status = 'approved';
    return Reservation.create(reserve);
  }
  if (reserve.start_date === today) {
    const dividedReservations = divideReservation(reserve);
    return Reservation.create(dividedReservations);
  }
  return Reservation.create(reserve);
};

// eslint-disable-next-line max-len
exports.updateReservation = async (reservation, found, requestedReservation, reservation_id, today, req) => {
  // eslint-disable-next-line no-mixed-operators
  if (found.length === 1 && found[0]._id.toString() === reservation_id || (!found.length)) {

    if (reservation.start_date === today && reservation.end_date === today) {
      // eslint-disable-next-line max-len
      const updated = await Reservation.findByIdAndUpdate(reservation_id, reservation, {new: true}).lean().exec();

      return updated;
    }

    if (reservation.start_date === today && !req.user.is_admin) {

      const deleted = await requestedReservation.delete();

      const deletedReservationProperties = {
        start_date: deleted.start_date,
        end_date: deleted.end_date,
        user_id: deleted.user_id,
        team_id: deleted.team_id,
        table_id: deleted.table_id,
        chair_id: deleted.chair_id,
        status: 'pending'
      };
      
      const reserve = {...deletedReservationProperties, ...excludeUndefinedFields(reservation)};

      const dividedReservations = divideReservation(reserve);

      const reservations = await Reservation.create(dividedReservations);

      return reservations;
    }
    // means there are no overlaping appointments
    const updated = await Reservation.findByIdAndUpdate(reservation_id,
      excludeUndefinedFields(reservation), {new: true})
      .lean()
      .exec();

    return updated;
  }
  return null;
};
