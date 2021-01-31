const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const {connectDB, Reservation} = require('booking-db');

const {getToday, getTodayReservations, divideReservation, getFormattedDate} = require('../src/utils/reservation-helpers');


const updateReservations = async () => {
  const today = getToday();
  const reservationsForToday = await Reservation.find({start_date: today, status: 'pending'});

};




connectDB(process.env.MONGO_URI).then( async (connection) => {
  try {
    await updateReservations();
    console.log('Job was done successfully');
    process.exit(0);
  } catch (err){
    console.log(err);
    process.exit(1);
  }
});





