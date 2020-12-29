const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const UserModel = require('booking-db').User;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc  sign-in
// @route /api/v1/auth/signin
// @access  Public

module.exports = async (req, res, next) => {
  let requested_user;

  const { token: idToken } = req.body;
  
  try {

    const ticket = await client.verifyIdToken({
      idToken,

      audience: process.env.GOOGLE_CLIENT_ID,

    });

    const payload = ticket.getPayload();

    const { email, photo_url } = payload;

    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      return next(new Error('Not invited'));
    }
    
    if (!user.accepted) {
      requested_user = await UserModel.findOneAndUpdate({ email }, { photo_url });
    } else {
      requested_user = user;
    }
    const token = await jwt.sign({
      _id: requested_user._id,
      email: requested_user.email,
      team_id: requested_user.team_id,
      is_admin: requested_user.is_admin
    }, process.env.JWT_SECRET);

    return res.status(202).json({
      token,
      user: requested_user
    });
  } catch (err) {
    // TODO: create Error handlers

    return next(new Error('Auth error'));
  }
};
