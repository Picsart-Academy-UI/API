const { Team } = require('db_picsart');
// const { NotFound, MongooseError, BadRequest } = require('../errors');

exports.create = async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Name required.'
    });
  }

  const team = new Team({ name });

  try {
    await team.save();
    return res.status(201).json(team);
  } catch (e) {
    return next(e);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const teams = await Team.find();
    return res.status(200).json(teams);
  } catch (e) {
    return next(e);
  }
};

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

exports.update = async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Name required.',
    });
  }

  const updated = { name };

  try {
    const team = await Team.findOneAndUpdate(
      { _id: req.params.team_id },
      { $set: updated },
      { new: true },
    );
    return res.status(200).json(team);
  } catch (e) {
    if (e instanceof MongooseError) {
      return next(new MongooseError(e.message));
    }
    return next(new NotFound());
  }
};

exports.deleteOne = async (req, res) => {
  try {
    await Team.deleteOne({ _id: req.params.team_id });
    res.status(200).json({
      message: 'Team was deleted.',
    });
  } catch (e) {
    console.error(e);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Team.deleteMany();
    return res.status(200).json({
      message: 'All teams were deleted',
    });
  } catch (e) {
    return next(e);
  }
};
