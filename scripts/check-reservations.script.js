const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const {connectDB, Reservation} = require('booking-db');

const {getToday, getFormattedDate, getPlainReservation, addOneDay} = require('../src/utils/reservation-helpers');


const updateReservations = async () => {
  const today = getToday();
  const reservationsForToday = await Reservation.find({start_date: today, status: 'pending'});
  for (const reservation of reservationsForToday) {
    const formattedEnd = getFormattedDate(reservation.end_date);
    if (formattedEnd === today){
      await reservation.update({status: 'approved'});
    } else {
      const nextReservation = getPlainReservation(reservation);
      await reservation.update({end_date: reservation.start_date});
      // eslint-disable-next-line max-len
      await Reservation.create({...nextReservation, start_date: addOneDay(nextReservation.start_date)});
    }
  }
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
}).catch((err) => {
  console.error(err);
  process.exit(1);
});






