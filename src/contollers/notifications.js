const webpush = require('web-push');
const { User } = require('booking-db');

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

// eslint-disable-next-line
exports.subscribe = async (req, res) => {
  try {
    const { _id } = req.user;

    const subscription = req.body;

    // UGLY: Used '.lean()' here, because mongo gave me error
    // but I can't use this instance to save after that
    const user = await User.findById(_id).lean().exec();
    const { push_subscriptions } = user;

    // TODO: Create a proper Error handling for this endpoint
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json('Subscription is not valid');
    }

    if (push_subscriptions.find((sub) => sub.endpoint === subscription.endpoint)) {
      return res.status(400).json('Subscribtion with given endpoint already exists');
    }

    const updated_user = await User.findByIdAndUpdate(_id,
      {
        $push: {
          push_subscriptions: subscription
        }
      },
      { new: true }).lean().exec();

    res.status(201).json(JSON.stringify(subscription));

    // Creating payload
    const payload = JSON.stringify({
      title: 'Picsart Booking Service',
      body: 'Notifications for Picsart booking is registrated',
      icon: 'https://seeklogo.com/images/P/picsart-icon-logo-EE8CEAAED8-seeklogo.com.png'
    });

    webpush.sendNotification(subscription, payload)
      .catch((err) => console.log(err));

  } catch (e) {
    console.error(e);
  }
};

// The following controller is just for example

exports.another_one = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).lean().exec();
    const { push_subscriptions } = user;

    res.status(201).json({});

    const payload = JSON.stringify({
      title: 'Another One',
      body: 'Another One',
      icon: 'https://www.dictionary.com/e/wp-content/uploads/2018/04/another-one.jpg'
    });

    for (const sub of push_subscriptions) {
      await webpush.sendNotification(sub, payload);
    }

  } catch (e) {
    console.error(e);
  }
};
