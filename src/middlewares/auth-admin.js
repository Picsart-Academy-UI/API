
const {asyncHandler} = require('./asyncHandler');
const {ErrorResponse} = require('../utils/errorResponse');

module.exports = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user && user.is_admin) {
    return next();
  }
  return next(new ErrorResponse('Not authorized', 401));
});
