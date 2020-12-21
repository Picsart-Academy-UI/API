const UserModel = require('picsart-booking-db-models').User;
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
    // TODO: ask if we need additional validation for admins like checking if the _id actually exists in the database;
    const admin = await UserModel.findById(decoded._id);
    if (admin && admin.isAdmin) {
      req.admin = admin;
      return next();
    }
    // TODO change all the errors to next new specifiedClassError();
    return res.status(400).json({
      success: false,
      msg: 'Not Authorized',
    });
  } catch (err) {
    next(err);
  }
};
