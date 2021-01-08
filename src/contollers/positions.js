const { Position } = require('db_picsart');
const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
  const position = await Position.create(req.body);
  return res.status(201).json({data: position});
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const positions = await Position.find();
  return res.status(200).json({data: positions});
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const position = await Position.findById(req.params.position_id);
  if (!position) {
    return next(new ErrorResponse(
      `Position not found with id of ${req.params.position_id}`,
      404
    ));
  }
  return res.status(200).json({data: position});
});

exports.update = asyncHandler(async (req, res, next) => {
  const position = await Position.findOneAndUpdate(
    { _id: req.params.position_id },
    { $set: req.body },
    { new: true },
    { runValidators: true }
  );
  if (!position) {
    return next(new ErrorResponse(
      `Position not found with id of ${req.params.position_id}`,
      404
    ));
  }
  return res.status(200).json({data: position});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const position = await Position.findById(req.params.position_id);
  if (!position) {
    return next(new ErrorResponse(
      `Position not found with id of ${req.params.position_id}`,
      404
    ));
  }
  await Position.deleteOne({ _id: req.params.position_id });
  res.status(200).json({
    message: 'Positions was deleted.',
  });
});
