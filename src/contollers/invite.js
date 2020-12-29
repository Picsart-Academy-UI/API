const UserModel = require('booking-db').User;

const { emailRegexp } = require('../utils/util');
const mailer = require('../utils/mailer');

// @desc  Admin invites the user
// @route /api/v1/auth/invite
// @access Private (Amin)

module.exports = async (req, res, next) => {

  const { email, is_admin, team_id, position, first_name, last_name, birthdate } = req.body;

  if (!emailRegexp.test(email)) {
    return next(new Error('wrong input email'));
  }
  
  try {
    const user = await UserModel.findOne({ email }).exec();
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

    const user_properties = {email, is_admin, team_id, position, first_name, last_name, birthdate};

    const created_user = await UserModel.create(user_properties);

    await mailer(email);

    return res.status(201).json({
      user: created_user,
    });
  } catch (err) {
    return next(new Error('Server error'));
  }
};
