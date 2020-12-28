const webpush = require('web-push');

const {
  WEBPUSH_MAILTO,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
} = process.env;

// TODO: add subscription to the User model after update of schema
// And get rid of this variable (or open a github issue, so I'll change it)
let subscription;

webpush.setVapidDetails(
  `mailto:${WEBPUSH_MAILTO}`,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

exports.subscribe = (req, res) => {
  subscription = req.body;
  // TODO: figure out bad request cases for subscription

  // UGLY: sending back the subscription object back for now ... just because :D
  res.status(201).json(JSON.stringify(subscription));

  // creating payload
  const payload = JSON.stringify({
    title: 'Picsart Booking Service',
    body: 'Notifications for Picsart booking is registrated',
    icon: 'https://seeklogo.com/images/P/picsart-icon-logo-EE8CEAAED8-seeklogo.com.png'
  });

  webpush.sendNotification(subscription, payload)
    .catch((err) => console.log(err));
};
