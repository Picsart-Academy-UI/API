const { User } = require('booking-db');

const {buildQuery, getPagination, findUserByIdAndUpdate} = require('../utils/util');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

// @desc  get users from the same team
// @route GET /api/v1/users
// @access Private (admin/user)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ team_id: req.user.team_id }).lean().exec();
  if (!users) {
    throw new ErrorResponse('User not found.', 404);
  }
  return res.status(200).json({
    data: users
  });
});

// @desc get all users query select sort etc
// @route GET /api/v1/users/all
// @access Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const queryObject = buildQuery(req.query);
  const initialQuery = User.find(queryObject);
  const count = await User.countDocuments(queryObject);
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
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).lean().exec();
  if (!user) {
    throw new ErrorResponse('User not found.', 404);
  }
  return res.status(200).json({
    data: user
  });
});

// @desc  update requested user
// @route  PUT /api/v1/:user_id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await findUserByIdAndUpdate(req.params.user_id, req).lean().exec();
  if (!user) {
    throw new ErrorResponse('User not found.', 404);
  }
  return res.status(200).json({
    data: user
  });
});

// @desc  delete requested user
// @route DELETE /api/v1/users/:user_id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.user_id).lean().exec();
  if (!user) {
    throw new ErrorResponse('User not found.', 404);
  }
  return res.status(200).json({
    message: 'User has successfully been deleted.'
  });
});

// @desc  get yourself
// @route /api/v1/users/me
// @access Private (User)
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean().exec();
  if (!user) {
    throw new ErrorResponse('User not found.', 404);
  }
  return res.status(200).json({
    data: user
  });
});
