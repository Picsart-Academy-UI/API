const jwt = require('jsonwebtoken');
const UserModel = require('booking-db').User;
const { OAuth2Client } = require('google-auth-library');

const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc  sign-in
// @route /api/v1/auth/signin
// @access  Public

module.exports = asyncHandler(async (req, res, next) => {
  let requested_user;

  const { token: idToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken,

    audience: process.env.GOOGLE_CLIENT_ID,

  });

  const payload = ticket.getPayload();

  const { email, photo_url } = payload;

  const user = await UserModel.findOne({ email }).exec();

  if (!user) {
    return next(new ErrorResponse('User not invited', 401));
  }

  if (!user.accepted) {
    requested_user = await UserModel.findOneAndUpdate({ email }, { photo_url });
  } else {
    requested_user = user;
  }
  const token = await jwt.sign({ ...requested_user }, process.env.JWT_SECRET);
  return res.status(202).json({
    token,
    user: requested_user
  });

});
