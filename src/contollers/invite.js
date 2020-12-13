const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// TODO: the regexp should be the same regexp from DB model user field email;
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');

let dbUserModel;

module.exports = async (req, res, next) => {
  const { email } = req.body;

  if (!emailRegExp.test(email)) {
    return next(new Error('invalid input email'));
  }

  try {
    let userExists;
    // TODO: uncomment the line below after DB models are ready
    // const userExists = await dbUserModel.findOne({email});

    if (!userExists) {
      const token = await jwt.sign({
        email,
      }, process.env.JWT_SECRET, { expiresIn: '2h' });
      const info = await mailer(email);
      return res.status(200).json({
        success: true,
        token,
      });
    }

    return res.status(400).json({
      success: false,
      msg: 'User has already been registered',
    });
  } catch (err) {
    console.log(err);
    return next(new Error('internal server error'));
  }
};
