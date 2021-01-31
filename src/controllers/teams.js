const { Team } = require('booking-db');

const { getPagination } = require('../utils/util');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { NotFound, BadRequest } = require('../utils/errorResponse');

exports.create = asyncHandler(async (req, res, next) => {
  const team = await Team.create(req.body);
  return res.status(201).json({ data: team });
});


// @desc  get all teams
// @route GET -> /api/vi/teams
// @access  Private (Admin)
exports.getAll = asyncHandler(async (req, res, next) => {

  const TeamsMembersCountTables = await Team
      .find()
      .populate({ path: 'members_count' })
      .populate({ path: 'tables', select: '_id -team_id table_number' })
      .lean()
      .exec();

  return res.status(200).json({
    data: TeamsMembersCountTables,
  });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const team = await Team
      .findById(req.params.team_id)
      .lean()
      .exec();

  if (!team) next(new NotFound());

  return res.status(200).json({ data: team });
});

exports.update = asyncHandler(async (req, res, next) => {
  const team = await Team.findByIdAndUpdate(
      { _id: req.params.team_id },
      { $set: req.body },
      { new: true, runValidators: true },
  );

  if (!team) next(new NotFound());

  return res.status(200).json({ data: team });
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const team = await Team
      .findById(req.params.team_id)
      .populate({ path: 'members_count' })
      .lean()
      .exec();

  if (!team) next(new NotFound());

  if (team.members_count !== 0) {
    return next(new BadRequest(
        `The ${team.team_name} team cannot be deleted because it has employees.`
    ));
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
