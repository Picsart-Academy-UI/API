const UserModel = require('booking-db').User;

exports.get_users = async (req, res, next) => {

    req.user = {
        is_admin: true,
        team_id: '5fe23b4bff4aa8d13eab0ddf'
    }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  let total_count;
  const start_index = (page - 1) * limit;
  const end_index = page * limit;
  const excluded_fields = ['select', 'select_all', 'page', 'limit', 'sort'];
  const query_string = { ...req.query };
  excluded_fields.forEach((field) => delete query_string[field]);
  // query_string = JSON.parse(JSON.stringify(query_string)
  //   .replace(/\b(gt|gte|lt|lte|in)\b/, (match) => `$${match}`));

  // PAGINATION
  let query;
  let pagination = null;
  const { is_admin, team_id } = req.user;
  try {
    if (!is_admin) {
      query = team_id ? UserModel.find({ team_id }) : [];
    } else if (req.query.select_all === 'true') {
      pagination = {};
      query = UserModel.find(query_string);
      query = query.skip(start_index).limit(limit);
      total_count = await UserModel.countDocuments();
      if (end_index < total_count) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }
      if (start_index > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }
      if (req.query.sort) {
        const sort_by = req.query.sort.split(',').join(' ');
        query = query.sort(sort_by);
      }
    } else {
      query = team_id ? UserModel.find({ team_id }) : [];
    }
    const requested_users = await query;
    res.status(200).json({
      success: true,
      data: requested_users,
      pagination,
      total_count: total_count || null
    });
  } catch (err) {
    next(new Error('Internal server error'));
  }
};

exports.update_user = async (req, res, next) => {
  const user = req.user;
  const { first_name, last_name, team_id, email
} = req.body;
  try {
    if (user.is_admin) {
      const {id} = req.query;
      if (id) {
        const updated_user = await UserModel.
          findByIdAndUpdate(id, { first_name, last_name, team_id, email }).exec();
        return res.status(204).json({
          success: true,
          msg: 'User has successfully been updated'
        });
      }
      const updated_user = await UserModel.findByIdAndUpdate(user._id, {
        first_name, last_name, team_id, email }).exec();
      return res.status(204).json({
        success: true,
        msg: 'User has successfully been updated'
      });
    }
    const updated_user = UserModel.findByIdAndUpdate(user._id, { first_name, last_name}).exec();
  } catch (err) {
    next(new Error('internal server error'));
  }
};

exports.delete_user = async (req, res, next) => {
  const user = req.user;
  const { id } = req.query;
  try {
    if (user.is_admin) {
      if (id){
        await UserModel.findByIdAndRemove(id).exec();
        return res.status(200).json({
          success: true,
          msg: 'The user has successfully been removed'
        });
      }
    }
    await UserModel.findByIdAndRemove(user._id).exec();
    return res.status(200).json({
      success: true,
      msg: 'You have successfully deleted your account'
    });
  } catch (err) {
    next(new Error('Internal server error'));
  }
};
