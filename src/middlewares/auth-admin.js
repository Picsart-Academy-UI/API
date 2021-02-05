const { asyncHandler } = require('./asyncHandler');
const { Unauthorized } = require('../utils/errorResponse');

module.exports = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user && user.is_admin) {
    return next();
  }
  return next(new Unauthorized('Not authorized'));
});
