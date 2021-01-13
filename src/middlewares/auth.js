const jwt = require('jsonwebtoken');
const {User: UserModel} = require('booking-db');

const {asyncHandler} = require('./asyncHandler');
const {ErrorResponse} = require('../utils/errorResponse');

module.exports = asyncHandler(async (req, res, next) => {
  return next();
  const {authorization} = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Token was not provided', 401));
  }
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded._id)
    .exec();
  if (user) {
    req.user = user;
    return next();
  }
  return next(new ErrorResponse('Not authorized', 401));
});
