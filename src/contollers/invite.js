const { find_one_user } = require('../utils/db_utils');
const { emailRegexp } = require('../utils/util');
const { create_user } = require('../utils/db_utils');

module.exports = async (req, res, next) => {
  const { email, _isAdmin, team_id } = req.body;

  // checking to see if the email input is valid

  if (!emailRegexp.test(email)) {
    return next(new Error('wrong input email'));
  }

  try {
    const user = await find_one_user(email);

    if (user) {
      if (user.accepted) {
        return next(new Error('User has already accepted the invitation'));
      }

      // TODO just resent the invitation ?

      return next('Invitation has been resend');
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
