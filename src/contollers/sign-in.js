const { asyncHandler } = require('../middlewares/asyncHandler');
const { BadRequest, Unauthorized } = require('../utils/errorResponse');
const { verifyIdToken, findUserByEmailAndUpdate, getJwt } = require('../utils/util');


// @desc  sign-in
// @route /api/v1/auth/signin
// @access  Public
module.exports = asyncHandler(async (req, res, next) => {
  const { token: idToken } = req.body;

  if (!idToken) {
    return next(new BadRequest('Token was not provided'));
  }
  const ticket = await verifyIdToken(idToken);

  const payload = ticket.getPayload();
  const { email, picture } = payload;
  const user = await findUserByEmailAndUpdate(email, picture);

  if (!user) {
    return next(new Unauthorized('User has not been invited'));
  }

  const token = await getJwt(user);
  return res.status(202).json({
    data: user,
    token,
  });
});
