const webpush = require('web-push');

const { asyncHandler } = require('../middlewares/asyncHandler');

const payload_template = {
    title: 'Picsart Booking Service',
    icon: 'https://seeklogo.com/images/P/picsart-icon-logo-EE8CEAAED8-seeklogo.com.png'
};

exports.reservationApproved = asyncHandler(async (start_date, end_date, subscriptions) => {
    const payload = JSON.stringify({
        ...payload_template,
        body: `Your reservations was approved,\n
         Start date: ${start_date}\n
         End date: ${end_date}`
    });

    for (const sub of subscriptions) {
        await webpush.sendNotification(sub, payload);
    }
});
