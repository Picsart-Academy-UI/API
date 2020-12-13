const jwt = require('jsonwebtoken');

const UserModel = require('picsart-booking-db-models').User;

function createUser(userDetails, requestedEmail) {
  const {
    first_name, last_name, team_id, password,
  } = userDetails;

  return UserModel.create({
    first_name, last_name, team_id, password, email: requestedEmail,
  });
}

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email } = decoded;

    const doesUserExist = await UserModel.findOne({ email });

    if (!doesUserExist) {
      const createdUser = await createUser(req.body, email);

      return res.status(201).json({
        success: true,
        data: createdUser,
      });
    }
    return res.status(400).json({
      success: false,
      msg: 'User has already been registered',
    });
  } catch (err) {
    return next(err);
  }
};
