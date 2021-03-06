const { User } = require('booking-db');

const {
  buildQuery, getPagination, findUserByIdAndUpdate
} = require('../utils/util');

const { NotFound } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

// @desc get all users query select sort etc
// @route GET /api/v1/users
// @access Private (Admin/User)
exports.getAllUsers = asyncHandler(async (req, res) => {
  let queryObject = buildQuery(req.query);

  if (!req.user.is_admin) queryObject = { ...queryObject, team_id: req.user.team_id };

  // searching by first_name
  if (req.query.first_name) {
    const regexp = new RegExp(`^${req.query.first_name}`, 'i');
    queryObject = { ...queryObject, first_name: regexp };
  }

  const initialQuery = User.find(queryObject);
  const count = await User.countDocuments(queryObject);

  // Pagination Logic & dynamic select of fields
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
  const user = await User
    .findById(req.params.user_id)
    .lean()
    .exec();

  if (!user) throw new NotFound('User not found.');

  return res.status(200).json({
    data: user
  });
});

// @desc  update requested user
// @route  PUT /api/v1/:user_id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await findUserByIdAndUpdate(req.params.user_id, req)
    .lean()
    .exec();

  if (!user) throw new NotFound('User not found.');

  return res.status(200).json({
    data: user
  });
});

// @desc  delete requested user
// @route DELETE /api/v1/users/:user_id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User
    .findByIdAndDelete(req.params.user_id)
    .lean()
    .exec();

  if (!user) throw new NotFound('User not found.');

  return res.status(200).json({
    message: 'User has successfully been deleted.'
  });
});

// @desc  get yourself
// @route /api/v1/users/me
// @access Private (User)
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User
    .findById(req.user._id)
    .lean()
    .exec();

  if (!user) throw new NotFound('User not found.');

  return res.status(200).json({
    data: user
  });
});

// @desc search users by given field
// @route /api/v1/users/search
// @access Private (User/Admin)
exports.search = asyncHandler(async (req, res, next) => {
  const { search_by: field, value, page, limit } = req.query;
  const regexp = new RegExp(`^${value}`, 'i');

  const users = User.find({ [field]: regexp });
  const count = await User.countDocuments({ [field]: regexp });

  const { pagination, query } = getPagination(page, limit, count, req, users);

  const result = await query.lean().exec();

  return res.status(200).json({
    data: result,
    count,
    pagination
  });
});
