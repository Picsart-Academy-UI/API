const UserModel = require('booking-db').User;

module.exports = async (req, res, next) => {
  // PAGINATION

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const start_index = (page - 1) * limit;
  const end_index = page * limit;
  let total_count;

  // PAGINATION
  let query;
  const pagination = {};
  const { is_admin, team_id } = req.user;

  try {
    if (!is_admin) {
      total_count = await UserModel.count({ team_id });
      query = team_id ? UserModel.find({ team_id }) : [];
    } else if (req.query.select_all === 'true') {
      total_count = await UserModel.count();
      query = UserModel.find();
    } else {
      total_count = await UserModel.count({ team_id });
      query = team_id ? UserModel.find({ team_id }) : [];
    }
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
    query = query.skip(start_index).limit(limit);
    const requested_users = await query;
    res.status(200).json({
      success: true,
      data: requested_users,
      pagination
    });
  } catch (err) {
    next(new Error('Internal server error'));
  }
};
