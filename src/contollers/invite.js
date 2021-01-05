const {User: UserModel} = require('booking-db');

const mailer = require('../utils/mailer');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

// @desc  Admin invites the user
// @route /api/v1/auth/invite
// @access Private (Amin)

module.exports = asyncHandler(async (req, res, next) => {

  const { email, is_admin, team_id, position_id, first_name, last_name, birthdate, phone } = req.body;

  const user = await UserModel.findOne({ email }).exec();
  if (user) {
    if (user.accepted) {
      return next(new ErrorResponse('User has already accepted the invitation', 409));
    }
    await mailer(email);

    return res.status(208).json({
      message: 'The invitation has successfully been resend'
    });
  }

  const user_properties = {email, is_admin, team_id, position_id, first_name, last_name, birthdate, phone};

  const created_user = await UserModel.create(user_properties);

  await mailer(email);

  return res.status(201).json({
    user: created_user,
  });
});
