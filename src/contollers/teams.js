const { Team } = require('booking-db');
const { NotFound } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { buildQuery, getPagination } = require('../utils/util');

exports.create = asyncHandler(async (req, res, next) => {
  const team = await Team.create(req.body);
  return res.status(201).json({data: team});
});

// @desc  get all teams
// @route GET -> /api/vi/teams
// @access  Private (Admin)
exports.getAll = asyncHandler(async (req, res, next) => {
  const queryObject = buildQuery(req.query);
  const initialQuery = Team.find(queryObject);

  const TeamsMembersCountTables = await Team.find()
    .populate({
      path: 'members_count',
    })
    .populate({
      path: 'tables',
    }).exec();

  const count = await Team.countDocuments(queryObject);

  const { pagination, query } = getPagination(
    req.query.page, req.query.limit, count, req, initialQuery
  );

  // const teams = await query;
  return res.status(200).json({
    data: TeamsMembersCountTables,
    count,
    pagination,
  });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.team_id).exec();
  if (!team) {
    return next(new NotFound());
  }
  return res.status(200).json({data: team});
});

exports.update = asyncHandler(async (req, res, next) => {
  const team = await Team.findOneAndUpdate(
    { _id: req.params.team_id },
    { $set: req.body },
    { new: true, runValidators: true },
  );
  if (!team) {
    return next(new NotFound());
  }
  return res.status(200).json({data: team});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.team_id).exec();
  if (!team) {
    return next(new NotFound());
  }
  await Team.deleteOne({ _id: req.params.team_id });
  return res.status(200).json({
    message: 'Team was deleted.',
  });
});

// @desc search teams by given field
// @route /api/v1/teams/search
// @access Private (User)

exports.search = asyncHandler(async (req, res) => {
  const { search_by: field, value, page, limit } = req.query;
  const regexp = new RegExp(`^${value}`, 'i');

  const teams = Team.find({ [field]: regexp });
  const count = await Team.countDocuments({ [field]: regexp });

  const { pagination, query } = getPagination(page, limit, count, req, teams);
  const result = await query.lean().exec();

  return res.status(200).json({
    data: result,
    count,
    pagination
  });
});