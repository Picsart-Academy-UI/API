const {User: UserModel} = require('booking-db');

const {ErrorResponse} = require('../utils/errorResponse');
const {asyncHandler} = require('../middlewares/asyncHandler');
const {getUserProperties, createUser, updateUser} = require('../utils/util');

// @desc  Admin invites the user
// @route /api/v1/auth/invite
// @access Private (Admin)

module.exports = asyncHandler(async (req, res, next) => {
  let user;

  const userProperties = getUserProperties(req);

  const found = await UserModel
    .findOne({email: userProperties.email})
    .lean()
    .exec();

  if (!found) {
    user = await createUser(userProperties);
    return res.status(201).json({data: user.toJSON()});
  }

  if (found.accepted) {
    return next(new ErrorResponse('User has already accepted the invitation', 409));
  }
  user = await updateUser(userProperties, found._id);
  return res.status(202).json({data: user.toJSON()});
});
