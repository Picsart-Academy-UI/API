const { User: UserModel } = require('booking-db');
const mailer = require('./mailer');

exports.update_user = (email, user_to_be_updated) => UserModel.findOneAndUpdate(
  { email },
  user_to_be_updated,
  { new: true },
);
exports.find_one_user = (email) => UserModel.findOne({email});

exports.create_user = async (user) => {
  let createdUser;
  let mailResponse;

  try {
    createdUser = await UserModel.create(user);

    mailResponse = await mailer(user.email);
  } catch (err) {
    console.log(err);
    throw err;
  }

  return createdUser;
};
