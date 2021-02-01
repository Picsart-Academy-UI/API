const { User: UserModel } = require('booking-db');

const { asyncHandler } = require('./asyncHandler');
const { Unauthorized } = require('../utils/errorResponse');
const { decodeToken } = require('../utils/util');

module.exports = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new Unauthorized('Token was not provided'));
  }
  const decoded = await decodeToken(token);
  const user = await UserModel.findById(decoded._id).exec();
  if (!user) {
    return next(new Unauthorized('Not authorized'));
  }
  req.user = user;
  return next();
});
