const { User } = require('booking-db');
const { Conflict } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { getUserProperties, createUserAndSendEmail } = require('../utils/util');


// @desc  Admin invites the user
// @route /api/v1/auth/invite
// @access Private (Admin)
module.exports = asyncHandler(async (req, res, next) => {
  const userProperties = getUserProperties(req);
  const user = await User
    .findOne({ email: userProperties.email })
    .lean()
    .exec();

  if (user) {
    next(new Conflict('User has already been invited'));
  }

  const created_user = await createUserAndSendEmail(userProperties);
  return res.status(201).json({ data: created_user.toJSON() });
});

