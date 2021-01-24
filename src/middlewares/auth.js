const {User: UserModel} = require('booking-db');

const {asyncHandler} = require('./asyncHandler');
const {ErrorResponse} = require('../utils/errorResponse');
const {decodeToken} = require('../utils/util');

module.exports = asyncHandler(async (req, res, next) => {
  const {authorization} = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    throw new ErrorResponse('Token was not provided', 401);
  }
  const decoded = await decodeToken(token);
  const user = await UserModel.findById(decoded._id).exec();
  console.log(user);
  if (!user) {
    throw new ErrorResponse('Not authorized', 401);
  }
  req.user = user;
  return next();
});
