const { User } = require('booking-db');
const { BadRequest, Unauthorized } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { verifyIdToken, findUserByEmailAndUpdate, getJwt } = require('../utils/util');

// @desc  sign-in
// @route /api/v1/auth/signin
// @access  Public
module.exports = asyncHandler(async (req, res, next) => {
  let ticket;
  const { token: idToken } = req.body;

  if (!idToken) {
    throw new BadRequest('Token was not provided');
  }

  try {
    ticket = await verifyIdToken(idToken);
  } catch (err) {
    console.log(err, 'ID token error');
  }

  const payload = ticket.getPayload();
  console.log('payload', payload);
  const users = await User.find({});
  console.log('allusers', users);
  const { email, picture } = payload;

  const user = await findUserByEmailAndUpdate(email, picture);

  if (!user) {
    throw new Unauthorized('User has not been invited');
  }

  const token = await getJwt(user);

  return res.status(202).json({
    data: user,
    token
  });
});