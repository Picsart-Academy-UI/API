const webpush = require('web-push');
const { User: UserModel } = require('db_picsart');

const {
  WEBPUSH_MAILTO,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
} = process.env;

// TODO: add subscription to the User model after update of schema
// And get rid of this variable (or open a github issue, so I'll change it)

webpush.setVapidDetails(
  `mailto:${WEBPUSH_MAILTO}`,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

// eslint-disable-next-line
exports.subscribe = async (req, res) => {
  const { user_id } = req.params;
  const subscription = req.body;
  // const user = await UserModel.findById(user_id).lean().exec();
  // const { push_subscriptions } = user;
  // const subs = [...push_subscriptions, subscription];

  const updated_user = await UserModel.findByIdAndUpdate(user_id, 
    { 
      $push: {
        push_subscriptions:{$each: subscription}
      }
    },
    { new: true }).exec();

  console.log(updated_user);
  // if (!subscription || !subscription.endpoint) {
  //   return res.status(400).json('Subscription must have an endpoint.');
  // }

  // if (subs.find((sub) => sub.endpoint === subscription.endpoint)) {
  //   return res.status(400).json('Subscribtion with givven endpoint already exists');
  // }
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

exports.another_one = (req, res) => {
  const { user_id } = req.params;
  
  const user = UserModel.findById(user_id).exec();
  const { push_subscriptions } = user;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'Another One',
    body: 'Another One',
    icon: 'https://www.dictionary.com/e/wp-content/uploads/2018/04/another-one.jpg'
  });

  push_subscriptions.forEach((sub) => {
    webpush.sendNotification(sub, payload)
      .catch((err) => console.log(err));
  });
};
