const { Chair } = require('booking-db');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
  const chair = await Chair.create(req.body);
  return res.status(201).json({data: chair});
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const chairs = await Chair.find();
  return res.status(200).json({data: chairs});
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const chair = await Chair.findById(req.params.chair_id);
  if (!chair) {
    return next(new ErrorResponse(
      `Chair not found with id of ${req.params.chair_id}`,
      404
    ));
  }
  return res.status(200).json({data: chair});
});

exports.update = asyncHandler(async (req, res, next) => {
  const chair = await Chair.findOneAndUpdate(
    { _id: req.params.chair_id },
    { $set: req.body },
    { new: true },
    { runValidators: true }
  );
  if (!chair) {
    return next(new ErrorResponse(
      `Chair not found with id of ${req.params.chair_id}.`,
      404
    ));
  }
  return res.status(200).json({data: chair});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const chair = await Chair.findById(req.params.chair_id);
  if (!chair) {
    return next(new ErrorResponse(
      `Chair not found with id of ${req.params.chair_id}`,
      404
    ));
  }
  await Chair.deleteOne({ _id: req.params.chair_id });
  res.status(200).json({
    message: 'Chair was deleted.',
  });
});
