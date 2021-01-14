const { User: UserModel } = require('booking-db');

const { asyncHandler } = require('./asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');
const { decodeToken } = require('../utils/util');

module.exports = asyncHandler(async (req, res, next) => {
  // const {authorization} = req.headers;
  // let token;
  // if (authorization && authorization.startsWith('Bearer')) {
  //   token = authorization.split(' ')[1];
  // }
  // if (!token) {
  //   throw new ErrorResponse('Token was not provided', 401);
  // }
  // const decoded = await decodeToken(token);
  // const user = await UserModel.findById(decoded._id).exec();
  // if (!user) {
  //   throw new ErrorResponse('Not authorized', 401);
  // }
  req.user = { _id: '60007f89c35b8e47f416dd5d', first_name: 'Lilit', last_name: 'Karapetyan', email: 'lilit.karapetyan.temp@gmail.com', is_admin: true, team_id: '60005a4a141552e97877a0ca', position: 'intern', birthdate: '2001-01-01', phone: '00000000' };
  return next();
});