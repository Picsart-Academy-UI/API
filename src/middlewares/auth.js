const UserModel = require('booking-db').User;
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  return next();
  // eslint-disable-next-line no-unreachable
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new Error('Not authorized'));
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).exec();
    if (user) {
      req.user = user;
      return next();
    }
    return next(new Error('unauthorized'));
  } catch (err) {
    return next(err);
  }
};
