const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User_model = require('booking-db').User;

const { update_user } = require('../utils/db_utils');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = async (req, res, next) => {
  let token;
  let requested_user;

  const { token: idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email, given_name: first_name, family_name: last_name, photo_url,
    } = payload;

    const user = await User_model.findOne({ email }).exec();

    if (!user) {
      return next(new Error('Not invited'));
    }

    if (!user.accepted) {
      const user_to_be_updated = { first_name, last_name, photo_url };
      requested_user = await update_user(email, user_to_be_updated);
      token = await jwt.sign({ ...requested_user }, process.env.JWT_SECRET);
    } else {
      requested_user = user;
      token = await jwt.sign({ ...user }, process.env.JWT_SECRET);
    }

    return res.status(202).json({
      success: true,
      token,
      user: requested_user
    });
  } catch (err) {
    // TODO: create Error handlers

    return next(new Error('Auth error'));
  }
};
