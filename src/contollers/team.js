const { Team } = require('booking-db');

exports.create = async (req, res, next) => {
  const team = new Team({
    name: req.body.name,
    members_count: req.body.members_count,
  });

  try {
    await team.save();
    res.status(201).json(team);
  } catch (e) {
    console.error(e);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (e) {
    console.error(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.team_id).lean();
    res.status(200).json(team);
  } catch (e) {
    console.error(e);
  }
};

exports.update = async (req, res, next) => {
  const updated = {
    name: req.body.name,
    members_count: req.body.members_count,
  };

  try {
    const team = await Team.findOneAndUpdate(
      { _id: req.params.team_id },
      { $set: updated },
      { new: true },
    );
    res.status(200).json(team);
  } catch (e) {
    console.error(e);
  }
};

exports.delete = async (req, res) => {
  try {
    await Team.deleteOne({ _id: req.params.team_id });
    res.status(200).json({
      message: 'Team deleted.',
    });
  } catch (e) {
    console.error(e);
  }
};
