const UserModel = require('booking-db').User;

const { ErrorResponse } = require('../utils/errorResponse');
const { getPagination, buildQuery } = require('../utils/util');
const { asyncHandler } = require('../middlewares/asyncHandler');

// @desc  get users from the same team
// @route GET /api/v1/users
// @access Private (admin/user)

exports.getUsers = asyncHandler(async (req, res, next) => {
  const { team_id } = req.user;
  if (!team_id) {
    return next(new ErrorResponse('Unauthorized', 401));
  }

  const users = await UserModel.find({ team_id }).exec();
  return res.status(200).json({
    users
  });
});

// @desc get all users query select sort etc
// @route GET /api/v1/users/all
// @access Private (Admin)

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const queryObject = buildQuery(req.query);
  let query = UserModel.find(queryObject);
  const count = await UserModel.countDocuments(queryObject);
  // dynamic select of fields
  const { select, sort } = req.query;
  if (select) {
    const fields = select.split(',').join(' ');
    query = query.select(fields);
  }
  // sorting
  if (sort) {
    const sort_by = sort.split(',').join(' ');
    query = query.sort(sort_by);
  }
  // Pagination Logic
  // eslint-disable-next-line max-len
  const { pagination, limit, start_index } = getPagination(req.query.page, req.query.limit, count);
  query = query.skip(start_index).limit(limit);
  const users = await query;
  return res.status(200).json({
    users,
    count,
    pagination,
  });

});

// @desc  get requested user
// @route GET /api/v1/user/:user_id
// @access  Private (Admin)

exports.getUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const found_user = await UserModel.findById(user_id).exec();
  if (found_user) {
    return res.status(200).json({
      user: found_user
    });
  }
  return next(new ErrorResponse(
    `User not found with id of ${user_id}`,
    404
  ));
});

// @desc  update requested user
// @route  PUT /api/v1/:user_id
// @access  Private (Admin)

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const { email, first_name, last_name, team_id, is_admin } = req.body;
  const updated_user = await UserModel.findByIdAndUpdate(user_id,
    { email, first_name, last_name, team_id, is_admin },
    { new: true, runValidators: true }).exec();
  if (updated_user) {
    return res.status(200).json({
      user: updated_user
    });
  }
  return next(new ErrorResponse(
    `User not found with id of ${user_id}`,
    404
  ));
});

// @desc  delete requested user
// @route DELETE /api/v1/users/:user_id
// @access  Private (Admin)

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const deleted_user = await UserModel.findByIdAndDelete(user_id).exec();
  if (deleted_user) {
    return res.status(200).json({
      message: 'User has successfully deleted'
    });
  }
  return next(new ErrorResponse(
    `User not found with id of ${user_id}`,
    404
  ));
});

// @desc  get yourself
// @route /api/v1/users/me
// @access Private (User)

exports.getMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const found_user = await UserModel.findById(_id).exec();
  return res.status(200).json({
    user: found_user
  });
});
