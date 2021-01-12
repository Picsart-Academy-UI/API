const { User: UserModel } = require('booking-db');

const {
  buildQuery,
  getPagination,
  excludeUndefinedFields,
} = require('../utils/util');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

// @desc  get users from the same team
// @route GET /api/v1/users
// @access Private (admin/user)
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { team_id } = req.user;
  const users = await UserModel.find({ team_id }).lean().exec();
  if (!users) {
    return next(new ErrorResponse('User not found.', 404));
  }
  return res.status(200).json({
    data: users
  });
});

// @desc get all users query select sort etc
// @route GET /api/v1/users/all
// @access Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const queryObject = buildQuery(req.query);
  const initialQuery = UserModel.find(queryObject);
  const count = await UserModel.countDocuments(queryObject);
  // Pagination Logic & dynamic select of fields
  // eslint-disable-next-line max-len
  const { pagination, query } = getPagination(
    req.query.page, req.query.limit, count, req, initialQuery
  );
  const users = await query.lean().exec();
  return res.status(200).json({
    data: users,
    count,
    pagination,
  });
});

// @desc  get requested user
// @route GET /api/v1/user/:user_id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const found_user = await UserModel.findById(user_id).lean().exec();
  if (!found_user) {
    return next(new ErrorResponse('User not found.', 404));
  }
  return res.status(200).json({
    data: found_user
  });
});

// @desc  update requested user
// @route  PUT /api/v1/:user_id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const { email, first_name, last_name, team_id, is_admin } = req.body;
  const user = excludeUndefinedFields({
    email,
    first_name,
    last_name,
    team_id,
    is_admin
  });
  const updated_user = await UserModel.findByIdAndUpdate(user_id,
    {$set: user},
    {
      new: true,
      runValidators: true
    }).lean().exec();
  if (!updated_user) {
    return next(new ErrorResponse('User not found.', 404));
  }
  return res.status(200).json({
    data: updated_user
  });
});

// @desc  delete requested user
// @route DELETE /api/v1/users/:user_id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const deleted_user = await UserModel.findByIdAndDelete(user_id).lean().exec();
  if (!deleted_user) {
    return next(new ErrorResponse('User not found.', 404));
  }
  return res.status(200).json({
    message: 'User has successfully been deleted.'
  });
});

// @desc  get yourself
// @route /api/v1/users/me
// @access Private (User)
exports.getMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const found_user = await UserModel.findById(_id).lean().exec();
  if (!found_user) {
    return next(new ErrorResponse('User not found.', 404));
  }
  return res.status(200).json({
    data: found_user
  });
});

// @desc search users by given field
// @route /api/v1/users/search
// @access Private (User/Admin)

exports.search = asyncHandler(async (req, res) => {
  const { search_by: field, value, page, limit } = req.query;
  const regexp = new RegExp(`^${value}`, 'i');

  const users = UserModel.find({ [field]: regexp });
  const count = await UserModel.countDocuments({ [field]: regexp });
  
  const { pagination, query } = getPagination(page, limit, count, req, users);

  const result = await query.lean().exec();

  return res.status(200).json({
    data: result,
    count,
    pagination
  });
});
