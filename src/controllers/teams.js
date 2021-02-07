const { Team } = require('booking-db');

const { buildQuery, getPagination } = require('../utils/util');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { NotFound, BadRequest } = require('../utils/errorResponse');

// @desc create team
// @route POST /api/v1/teams
// @access Private (Admin)
exports.create = asyncHandler(async (req, res, next) => {
  const team = await Team.create(req.body);
  return res.status(201).json({ data: team });
});

// @desc  get all teams
// @route GET -> /api/vi/teams
// @access  Private (Admin)
exports.getAll = asyncHandler(async (req, res, next) => {
  let queryObject = buildQuery(req.query);

  if (!req.user.is_admin) queryObject = { ...queryObject, _id: req.user.team_id };

  const initialQuery = Team
    .find(queryObject)
    .populate({ path: 'members_count' })
    .populate({ path: 'tables', select: '_id team_name -team_id' });

  const count = await Team.countDocuments(queryObject);

  const { pagination, query } = getPagination(
    req.query.page, req.query.limit, count, req, initialQuery
  );

  const TeamsMembersCountTables = await query.lean().exec();

  return res.status(200).json({
    data: TeamsMembersCountTables,
    count,
    pagination
  });
});

// @desc get requested team
// @route GET /api/v1/teams/:team_id
// @access Private (Admin)
exports.getOne = asyncHandler(async (req, res, next) => {
  const team = await Team
    .findById(req.params.team_id)
    .lean()
    .exec();
  if (!team) throw new NotFound();

  return res.status(200).json({ data: team });
});

// @desc update requested team
// @route PUT /api/v1/teams/:team_id
// @access Private (Admin)
exports.update = asyncHandler(async (req, res, next) => {
  const team = await Team.findByIdAndUpdate(
    { _id: req.params.team_id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!team) next(new NotFound());

  return res.status(200).json({ data: team });
});

// @desc delete requested team
// @route DELETE /api/v1/teams/:team_id
// @access Private (Admin)
exports.deleteOne = asyncHandler(async (req, res, next) => {
  const team = await Team
    .findById(req.params.team_id)
    .lean()
    .exec();

  if (!team) next(new NotFound());

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
