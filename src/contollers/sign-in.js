const jwt = require('jsonwebtoken');
const { User: UserModel } = require('booking-db');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

// @desc  sign-in
// @route /api/v1/auth/signin
// @access  Public
module.exports = asyncHandler(async (req, res, next) => {
  let requested_user;
  const { token: idToken } = req.body;
  if (!idToken) {
    return next(new ErrorResponse('Unauthorized', 401));
  }
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, photo_url } = payload;
  const user = await UserModel.findOne({ email }).exec();
  if (!user) {
    return next(new ErrorResponse('This user has not been invited', 401));
  }
  if (!user.accepted) {
    requested_user = await UserModel.findOneAndUpdate(
      {email}, {
        profile_picture: photo_url,
        accepted: true
      }, {new: true}
    );
  } else {
    requested_user = user;
  }
  const token = await jwt.sign({
    _id: requested_user._id,
    email: requested_user.email,
    team_id: requested_user.team_id,
    is_admin: requested_user.is_admin
  }, process.env.JWT_SECRET);
  return res.status(202).json({
    data: requested_user,
    token
  });
});
