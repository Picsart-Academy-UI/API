const UserModel = require('booking-db').User;
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
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
    // TODO change all the errors to next new specifiedClassError();
    return res.status(400).json({
      success: false,
      msg: 'Not Authorized',
    });
  } catch (err) {
    return next(err);
  }
};
