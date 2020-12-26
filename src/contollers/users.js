const UserModel = require('booking-db').User;

const { getPagination } = require('../utils/util');

const { build_query } = require('../utils/util');

// @desc  get users from the same team
// @route GET /api/v1/users
// @access Private (admin/user)

exports.getUsers = async (req, res, next) => {
  const { team_id } = req.user;
  if (!team_id) {
    return next(new Error('Unauthorized'));
  }
  try {
    const users = await UserModel.find({ team_id }).exec();
    return res.status(200).json({
      users
    });
  } catch (err) {
    next(new Error());
  }
};

// @desc get all users query select sort etc
// @route GET /api/v1/users/all
// @access Private (Admin)

exports.getAllUsers = async (req, res, next) => {
  const queryObject = build_query(req.query);
  try {
    let query = UserModel.find(queryObject);
    const count = await UserModel.countDocuments();
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
    const {
      page, limit, start_index, end_index
    } = getPagination(req.query.page, req.query.limit);
    query = query.skip(start_index).limit(limit);
    const pagination = {};
    if (end_index < count) {
      pagination.next_page = page + 1;
    }
    if (start_index > 0) {
      pagination.prev_page = page - 1;
    }
    const users = await query;
    res.status(200).json({
      users,
      count,
      pagination,
    });
  } catch (err) {
    return next(new Error('Internal server error'));
  }
};

// @desc  get requested user
// @route GET /api/v1/user/:user_id
// @access  Private (Admin)

exports.getUser = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const found_user = await UserModel.findById(user_id).exec();
    res.status(200).json({
      user: found_user
    });
  } catch (err) {
    next(new Error('Internal server error'));
  }
};

// @desc  update requested user
// @route  PUT /api/v1/:user_id
// @access  Private (Admin)

exports.updateUser = async (req, res, next) => {
  const { user_id } = req.params;
  const {
    email, first_name, last_name, team_id
  } = req.body;
  try {
    const updated_user = await UserModel.findByIdAndUpdate(user_id, {
      email,
      first_name,
      last_name,
      team_id
    }, { new: true }).exec();
    res.status(204).json({
      user: updated_user
    });
  } catch (err) {
    next(new Error('internal server error'));
  }
};

// @desc  delete requested user
// @route DELETE /api/v1/users/:user_id
// @access  Private (Admin)

exports.deleteUser = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const deleted_user = await UserModel.findByIdAndDelete(user_id).exec();
    res.status(200).json({
      msg: 'User has successfully deleted'
    });
  } catch (err) {
    next(new Error('Internal server error'));
  }
};

// @desc  get yourself
// @route /api/v1/users/me
// @access Private (User)

exports.getMe = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const found_user = await UserModel.findById(_id).exec();
    res.status(200).json({
      user: found_user
    });
  } catch (err) {
    next(new Error('Internal server error'));
  }
};
// eslint-disable-next-line max-len
// TODO : when the format of an object Id is correct but there is no user in the DB the mongoose does not throw an error solve this one
//
