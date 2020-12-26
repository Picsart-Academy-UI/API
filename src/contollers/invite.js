const User_model = require('booking-db').User;

const { emailRegexp } = require('../utils/util');
const { create_user } = require('../utils/db_utils');
const mailer = require('../utils/mailer');

module.exports = async (req, res, next) => {
  const { email, _isAdmin, team_id } = req.body;

  if (!emailRegexp.test(email)) {
    return next(new Error('wrong input email'));
  }

  // TODO: make code sync with DB models
  try {
    const user = await User_model.findOne({ email }).exec();
    if (user) {
      if (user.accepted) {
        return next(new Error('User has already accepted the invitation'));
      }
      await mailer(email);

      return res.status(208).json({
        success: true,
        msg: 'The invitation has successfully been resend'
      });
    }

    const user_properties = { email, _isAdmin, team_id };

    const created_user = await create_user(user_properties);

    return res.status(201).json({
      success: true,
      msg: 'The user has successfully been initialized!',
    });
  } catch (err) {
    return next(new Error('Server error'));
  }
};
