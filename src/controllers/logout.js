const { User } = require('booking-db');
const { asyncHandler } = require('../middlewares/asyncHandler');

module.exports = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { endpoint } = req.body;

  await User.findByIdAndUpdate(_id,
    { $pull: { push_subscriptions: { endpoint } } },
    {
      safe: true,
      multi: true,
      new: true
    })
    .lean()
    .exec();

  return res.status(200)
    .json({message: 'Logged out!'});

});
