const webpush = require('web-push');
const moment = require('moment-timezone');
const { Table, Chair, User } = require('booking-db');

const payload_template = {
  title: 'Picsart Booking Service',
  icon: 'https://seeklogo.com/images/P/picsart-icon-logo-EE8CEAAED8-seeklogo.com.png'
};

exports.reservationNotification = async (reservation) => {
  const { user_id } = reservation;
  const user = await User.findById(user_id);
  const { push_subscriptions: subscriptions } = user;
  const { start_date, end_date, table_id, chair_id, status } = reservation;
  if (status === 'pending') return;
  const table = await Table.findById(table_id);
  const chair = await Chair.findById(chair_id);

  const start_date_formated = moment(start_date).format('YYYY-MM-DD');
  const end_date_formated = moment(end_date).format('YYYY-MM-DD');

  const payload = JSON.stringify({
    ...payload_template,
    body: `Picsart booking service reservation\n
         Start date: ${start_date_formated}\n
         End date: ${end_date_formated}\n
         Table: ${table.table_number}\n
         Chair: ${chair.number}\n
         Status: ${status}`
  });

  for (const sub of subscriptions) {
    await webpush.sendNotification(sub, payload);
  }
};
