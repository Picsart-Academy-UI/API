const webpush = require('web-push');
const moment = require('moment-timezone');
const { Table, Chair } = require('booking-db');

const { asyncHandler } = require('../middlewares/asyncHandler');

const payload_template = {
    title: 'Picsart Booking Service',
    icon: 'https://seeklogo.com/images/P/picsart-icon-logo-EE8CEAAED8-seeklogo.com.png'
};

exports.reservationNotification = asyncHandler(async (message, reservation, subscriptions) => {
    const { start_date, end_date, table_id, chair_id } = reservation;
    const table = await Table.findById(table_id);
    const chair = await Chair.findById(chair_id);

    const start_date_formated = moment(start_date).format('YYYY-MM-DD');
    const end_date_formated = moment(end_date).format('YYYY-MM-DD');

    const payload = JSON.stringify({
        ...payload_template,
        body: `Your reservation was updated\n
         Start date: ${start_date_formated}\n
         End date: ${end_date_formated}\n
         Table: ${table.table_name}\n
         Chair: ${chair.number}`
    });

    for (const sub of subscriptions) {
        await webpush.sendNotification(sub, payload);
    }
});
