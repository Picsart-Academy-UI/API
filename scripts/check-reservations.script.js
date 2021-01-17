const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const {connectDB, Reservation} = require('booking-db');

const {getToday, getTodayReservations, divideReservation, getFormattedDate} = require('../src/utils/reservation-helpers');

const updateReservation = async (reservation) => {
  const today = getToday();
  const end = getFormattedDate(reservation.end_date);
  const start = getFormattedDate(reservation.start_date);
  if (end === today){
    const updated = await Reservation.findByIdAndUpdate(reservation._id, {
      status: 'approved'
    }, {new: true, runValidators: true}).lean().exec();
    return updated;
  }
  if (start === today){
    const deleted = await Reservation.fndByIdAndDelete(reservation._id).lean().exec();
    const divided = divideReservation(deleted);
    const created = await Reservation.create(divided);
    return created;
  }
};



const updateTodayReservations = async () => {
  let foundReservations;
  try {
    foundReservations = await getTodayReservations();
  } catch (err) {
    console.log('error occurred while getting the reservations', err);
    process.exit(1);
  }
  for (const reservation of foundReservations){
    try {
      const updated = await updateReservation(reservation);
    } catch (err){
      console.log(`Error occurred while updating the reservations with id ${reservation._id}`, err);
    }
  }
  return null;
};


connectDB(process.env.MONGO_URI).then(async (connection) => {
  try {
    await updateTodayReservations();
    console.log('Job was done successfully');
    process.exit(0);
  } catch (err){
    console.log(err);
    process.exit(1);
  }
}).catch((err) => {
  console.log('Error occurred while connecting to DB', err);
  process.exit(1);
});







