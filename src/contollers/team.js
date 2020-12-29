const { Team } = require('booking-db');
// const { NotFound, MongooseError, BadRequest } = require('../errors');

// @desc  create a team
// @route POST -> /api/vi/teams
// @access  Private (Admin)

exports.create = async (req, res, next) => {
  const { name } = req.body;
  const team = new Team({ name });
  try {
    await team.save();
    return res.status(201).json(team);
  } catch (e) {
    return next(e);
  }
};

// @desc  get all teams
// @route GET -> /api/vi/teams
// @access  Private (Admin)

exports.getAll = async (req, res, next) => {
  try {
    const teams = await Team.find();
    return res.status(200).json(teams);
  } catch (e) {
    return next(e);
  }
};

// @desc  get one team
// @route GET -> /api/vi/teams/:team_id
// @access  Private (Admin)

exports.getOne = async (req, res, next) => {
  const { team_id } = req.params;
  if (!team_id) {
    return res.status(400).json({
      message: 'Please provide a team id.'
    });
  }
  try {
    const team = await Team.findById(team_id);
    return res.status(200).json(team);
  } catch (e) {
    return next(e);
  }
};

// @desc  update a team
// @route PUT -> /api/vi/teams/:team_id
// @access  Private (Admin)

exports.update = async (req, res, next) => {
  const { name } = req.body;
  const { team_id } = req.params;
  const updated = { name };

  try {
    const team = await Team.findByIdAndUpdate(
      team_id,
      updated,
      { new: true, runValidators: true },
    );
    return res.status(200).json(team);
  } catch (e) {
    next(new Error('errror'));
    // if (e instanceof MongooseError) {
    //   return next(new MongooseError(e.message));
    // }
    // return next(new NotFound());
  }
};

// @desc  delete a team
// @route DELETE -> /api/vi/teams/:team_id
// @access  Private (Admin)

exports.deleteOne = async (req, res) => {
  const { team_id } = req.params;
  try {
    await Team.findByIdAndDelete(team_id);
    res.status(200).json({
      message: 'Team was deleted.',
    });
  } catch (e) {
    console.error(e);
  }
};
