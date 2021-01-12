const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');
const {verifyIdToken, findUserByEmailAndUpdate, getJwt} = require('../utils/util');

// @desc  sign-in
// @route /api/v1/auth/signin
// @access  Public
module.exports = asyncHandler(async (req, res, next) => {

  const { token: idToken } = req.body;

  if (!idToken) {
    throw new ErrorResponse('Token was not provided', 401);
  }

  const ticket = await verifyIdToken(idToken);
  const payload = ticket.getPayload();

  const { email, picture } = payload;

  const user = await findUserByEmailAndUpdate(email, picture);

  if (!user) {
    throw new ErrorResponse('User has not been invited', 401);
  }

  const token = await getJwt(user);

  return res.status(202).json({
    data: user,
    token
  });
});
