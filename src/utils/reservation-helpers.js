const moment = require('moment-timezone');
const {Reservation} = require('booking-db');



const moment1 = require('moment');
const momentTimezone = require('moment-timezone');

const {ErrorResponse} = require('./errorResponse');

const format = 'YYYY-MM-DD';

const getToday = () => moment().tz('Asia/Yerevan').format(format);

const formatDate = (date) => moment(date).format(format);

const checkWeekends = (reservation) => {
    const {start_date, end_date} = reservation;
    let d1 = new Date(start_date),
        d2 = new Date(end_date),
        isWeekend = false;
    while (d1 <= d2) {
        let day = d1.getDay();
        isWeekend = (day === 6) || (day === 0);
        if (isWeekend) { return true; }
        d1.setDate(d1.getDate() + 1);
    }
    return false;
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

const checkReservationDates = (reservation) => {
    const {start_date, end_date} = reservation;
    const start = formatDate(start_date);
    const end = formatDate(end_date);
    const today = getToday();
    return start >= today && end >= today && end >= start;
};

const getPlainReservation = (reservation) => {
    const {start_date, end_date, user_id, team_id, table_id, chair_id, status} = reservation;
    let start, end;
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

const checkRange = (oldReservation, newReservation) => {
    const newStart = formatDate(newReservation.start_date);
    const newEnd = formatDate(newReservation.end_date);
    const oldStart = formatDate(oldReservation.start_date);
    const oldEnd = formatDate(oldReservation.end_date);
    const startCheck = newStart >= oldStart && newStart <= oldEnd;
    const endCheck = newEnd >= oldStart && newEnd <= oldEnd;
    return startCheck && endCheck;
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
                start_date: {$eq: end_date}
            }
        ],
        chair_id
    }).sort('rating');
};

const chekToday = (reservation) => {

    const today = getToday();

    if (reservation.start_date !== today) return reservation;

    if (reservation.end_date === today) {
        // eslint-disable-next-line no-param-reassign
        reservation.status = 'approved';
        return reservation;
    }

    const {start_date, end_date, table_id, chair_id, team_id, user_id} = reservation;

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
        status: 'pending',
        team_id,
        user_id
    });

    return [reserve_1, reserve_2];
};

// Create Reservation

exports.createReservation = (req) => {

    if (req.user.is_admin) {
        req.body.status = 'approved';
        req.body.user_id = req.body.user_id || req.user._id;
        const plainReservation = getPlainReservation(req.body);
        return Reservation.create(plainReservation);
    }

    req.body.status = 'pending';
    req.body.team_id = req.user.team_id;
    req.body.user_id = req.user._id;

    const plainReservation = getPlainReservation(req.body);

    const reservation = chekToday(plainReservation);
    // eslint-disable-next-line max-len
    // due to mongoose the create method when passed many document will internaly call the save function seperatley
    if (reservation.length > 0) {
        return Reservation.insertMany(reservation);
    }
    return Reservation.create(reservation);
};

// Update Reservation;
exports.updateReservation = async (req) => {
    const {reservation_id} = req.params;
    if (req.user.is_admin) {
        const { status } = req.body;
        if (status === 'approved' || status === 'rejected'){
            const reservation = await Reservation.findOneAndUpdate({_id: reservation_id, status: 'pending'}, {status}, {new: true});
            if (!reservation) throw new ErrorResponse('Reservation was not found', 404);
            return reservation;
        }
        throw new ErrorResponse('The admin can only modify the status to approved or rejected', 400);
    }
    const found = await Reservation.findById(reservation_id);
    if (!found) throw new ErrorResponse('The reservation was not found');
    const {start_date, end_date} = req.body;
    const toBeInserted = getPlainReservation(attachMissingFields({start_date, end_date}, found));
    if (!checkReservationDates(toBeInserted)) throw new ErrorResponse('Incorrect dates', 400);
    if (checkWeekends(toBeInserted)) throw new ErrorResponse('Reservation cannot contain weekends', 400);
    const conflictingReservations = await getConflictingReservations(toBeInserted);
    // eslint-disable-next-line no-mixed-operators,max-len
    if (conflictingReservations.length === 1 && conflictingReservations[0]._id.toString() === reservation_id || !conflictingReservations.length) {
       if (found.status === 'approved' && checkRange(found, toBeInserted) ){
           // eslint-disable-next-line max-len
           const reservation = await Reservation.findByIdAndUpdate(reservation_id, toBeInserted, {new: true});
           return reservation;
       }
       const reservation = chekToday(toBeInserted);
       if (reservation.length){
           await Reservation.findByIdAndDelete(reservation_id);
           const inserted = await Reservation.insertMany(reservation);
           return inserted;
       }
       reservation.status = 'pending';
        // eslint-disable-next-line max-len
       const inserted = await Reservation.findByIdAndUpdate(reservation_id, reservation, {new: true});
       return inserted;
    }
    throw new ErrorResponse('Conflict with the reservation period', 400);
};

exports.findOneReservation = (req) => {
    if (req.user.is_admin) {
        return Reservation.findById(req.params.reservation_id);
    }
    return Reservation.findOne({_id: req.params.reservation_id, team_id: req.user.team_id});
};

exports.deleteOneReservation = (req) => {
    return Reservation.findOneAndDelete({user_id: req.user._id,
        _id: req.params.reservation_id,
        $or: [{status: 'pending'}, {status: 'approved'}]});
};

exports.getTodayReservations = () => {
    const today = getToday();
    return Reservation.find({start_date: today, status: 'pending'}).lean().exec();
};

exports.getFormattedDate = (date) => {
    return moment(date).format(format);
};

exports.seeLoadReservations = async (req) => {
    const {start_date, end_date, team_id} = req.query;
    const results = await Reservation.find(
        // eslint-disable-next-line max-len
        {$and: [{start_date: {$gte: new Date(start_date)}}, {start_date: {$lte: new Date(end_date)}}], team_id}
    ).select('start_date end_date').lean().exec();
    const a = moment1(start_date);
    const b = moment1(end_date);
    const diff = b.diff(a, 'days');
    if (diff > 32) throw new ErrorResponse('Max range is 31 days', 400);
    const arr = [];
    // eslint-disable-next-line no-plusplus
    let acc = momentTimezone(start_date);
    for (let i = 0; i < diff; i++) {
        const start = acc.format(format);
        const count = results.filter( (i) => {
            const momentStart = momentTimezone(i.start_date).format(format);
            const momentEnd = momentTimezone(i.end_date).format(format);
            return start >= momentStart && momentEnd >= start;
        }).length;
        arr.push({[start]: count});
        acc = acc.add(1, 'day');
    }
    return arr;
};

exports.getToday = getToday;
exports.formatDate = formatDate;
