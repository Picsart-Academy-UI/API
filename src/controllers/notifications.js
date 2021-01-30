const webpush = require('web-push');
const { User } = require('booking-db');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { ErrorResponse, BadRequest, Conflict } = require('../utils/errorResponse');

const {
  WEBPUSH_MAILTO,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
} = process.env;

webpush.setVapidDetails(
  `mailto:${WEBPUSH_MAILTO}`,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

exports.subscribe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const subscription = req.body;

  const user = await User.findById(_id).lean().exec();
  const { push_subscriptions } = user;

  if (!subscription || !subscription.endpoint) {
    return next(new BadRequest('Subscription is not valid'));
  }

  if (push_subscriptions.find((sub) => sub.endpoint === subscription.endpoint)) {
    return next(new Conflict('Subscribtion with given endpoint already exists'));
  }

  await User.findByIdAndUpdate(_id,
    {
      $push: {
        push_subscriptions: subscription
      }
    },
    { new: true }).exec();

  res.status(201).json(JSON.stringify(subscription));

  // Creating payload
  const payload = JSON.stringify({
    title: 'Picsart Booking Service',
    body: 'Notifications for Picsart booking is registrated',
    icon: 'https://seeklogo.com/images/P/picsart-icon-logo-EE8CEAAED8-seeklogo.com.png'
  });

  return webpush.sendNotification(subscription, payload)
    .catch((err) => next(new ErrorResponse(err.message)));

});
