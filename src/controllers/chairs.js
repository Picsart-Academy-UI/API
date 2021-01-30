const { Chair } = require('booking-db');

const { NotFound } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
  const chair = await Chair.create(req.body);
  return res.status(201).json({ data: chair });
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const chairs = await Chair.find().lean().exec();
  return res.status(200).json({ data: chairs });
});

exports.getOne = asyncHandler(async (req, res, next) => {

  const chair = await Chair
    .findById(req.params.chair_id)
    .lean()
    .exec();

  if (!chair) {
    next(new NotFound());
  }

  return res.status(200).json({ data: chair });
});

exports.update = asyncHandler(async (req, res, next) => {
  const chair = await Chair.findByIdAndUpdate(
    { _id: req.params.chair_id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!chair) {
    next(new NotFound());
  }

  return res.status(200).json({ data: chair });
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const chair = await Chair
    .findById(req.params.chair_id)
    .lean()
    .exec();

  if (!chair) {
    next(new NotFound());
  }

  await Chair.deleteOne({ _id: req.params.chair_id });
  return res.status(200).json({
    message: 'Chair was deleted.',
  });
});
