const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const { find_one_user } = require('../utils/db_utils');
const { update_user } = require('../utils/db_utils');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = async (req, res, next) => {
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

    const user = await find_one_user(email);

    if (!user) {
      return next(new Error('Not invited'));
    }

    const user_to_be_updated = { first_name, last_name, photo_url };

    const updated_user = await update_user(email, user_to_be_updated);

    const token = await jwt.sign({ ...updated_user }, process.env.JWT_SECRET);

    return res.status(202).json({
      success: true,
      token
    });
  } catch (err) {
    // TODO: create Error handlers

    return next(new Error('Auth error'));
  }
};
