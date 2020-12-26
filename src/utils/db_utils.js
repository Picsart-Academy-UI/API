const { User: UserModel } = require('booking-db');
const mailer = require('./mailer');

exports.update_user = (email, user_to_be_updated) => UserModel.findOneAndUpdate(
  { email },
  user_to_be_updated,
  { new: true },
).exec();
exports.find_one_user = (email) => UserModel.findOne({ email }).exec();

exports.create_user = async (user) => {
  let createdUser;
  let mailResponse;

  // eslint-disable-next-line no-useless-catch
  try {
    createdUser = await UserModel.create(user);

    mailResponse = await mailer(user.email);
  } catch (err) {
    throw err;
  }

  return createdUser;
};
