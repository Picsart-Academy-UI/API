const { User: UserModel } = require('booking-db');

const mailer = require('../utils/mailer');
<<<<<<< HEAD
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');
const {checkUserProperties} = require('../utils/util');
=======
const {ErrorResponse} = require('../utils/errorResponse');
const {asyncHandler} = require('../middlewares/asyncHandler');
>>>>>>> c184eed6c3321bf50458fe66e59e6aa048b0569a

// @desc  Admin invites the user
// @route /api/v1/auth/invite
// @access Private (Admin)

module.exports = asyncHandler(async (req, res, next) => {

<<<<<<< HEAD
  const {body} = req;

  const {
    email, is_admin, team_id,
    position_id, first_name, last_name, birthdate, phone
  } = body;

  const user_properties = {
    email,
    is_admin,
    team_id,
    position_id,
    first_name,
    last_name,
    birthdate,
    phone
  };

  const user = await UserModel.findOne({email})
    .lean()
=======
  const {
    email, is_admin, team_id,
    position_id, first_name, last_name, birthdate, phone
  } = req.body;

  const user = await UserModel.findOne({email})
>>>>>>> c184eed6c3321bf50458fe66e59e6aa048b0569a
    .exec();
  if (user) {
    if (user.accepted) {
      return next(new ErrorResponse('User has already accepted the invitation', 409));
    }

<<<<<<< HEAD
    const updated_user = await UserModel.findOneAndUpdate({_id: user._id}, {
      email,
      is_admin,
      team_id,
      position_id,
      first_name,
      last_name,
      birthdate,
      phone
    }, {new: true, runValidators: true}).lean().exec();

    try {
      await mailer(email);
    } catch (err) {
      return res.status(207).json({
        data: updated_user,
        message: 'Due to some issues the invitation has not been sent, please try again'
      });
    }
    return res.status(208).json({
      data: updated_user
    });
  }

=======
    return res.status(208)
      .json({
        message: 'The invitation has successfully been resend'
      });
  }

  const user_properties = {
    email,
    is_admin,
    team_id,
    position_id,
    first_name,
    last_name,
    birthdate,
    phone
  };

>>>>>>> c184eed6c3321bf50458fe66e59e6aa048b0569a
  const created_user = await UserModel.create(user_properties);

  try {

    await mailer(email);

  } catch (err) {
    return res.status(207).json({
      data: created_user.toJSON(),
      message: 'Due to some issues the invitation has not been sent, please try again'
    });
  }

<<<<<<< HEAD
  return res.status(201).json({
    data: created_user.toJSON(),
  });
=======
  return res.status(201)
    .json({
      user: created_user,
    });
>>>>>>> c184eed6c3321bf50458fe66e59e6aa048b0569a
});
