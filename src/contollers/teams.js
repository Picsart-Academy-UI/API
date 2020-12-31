const { Team } = require('booking-db');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
  const team = await Team.create(req.body);
  return res.status(201).json({data: team});
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const teams = await Team.find();
  return res.status(200).json({data: teams});
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.team_id);
  if (!team) {
    return next(new ErrorResponse(
      `Team not found with id of ${req.params.team_id}`,
      404
    ));
  }
  return res.status(200).json({data: team});
});

exports.update = asyncHandler(async (req, res, next) => {
  const team = await Team.findOneAndUpdate(
    { _id: req.params.team_id },
    { $set: req.body },
    { new: true },
    { runValidators: true }
  );
  if (!team) {
    return next(new ErrorResponse(
      `Team not found with id of ${req.params.team_id}`,
      404
    ));
  }
  return res.status(200).json({data: team});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.team_id);
  if (!team) {
    return next(new ErrorResponse(
      `Team not found with id of ${req.params.team_id}`,
      404
    ));
  }
  await Team.deleteOne({ _id: req.params.team_id });
  res.status(200).json({
    message: 'Teams was deleted.',
  });
});

exports.deleteAll = asyncHandler(async (req, res, next) => {
  await Team.deleteMany();
  return res.status(200).json({
    message: 'All teams were deleted',
  });
});
