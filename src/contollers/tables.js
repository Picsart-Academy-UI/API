const { Table } = require('booking-db');

const { ErrorResponse } = require('../utils/errorResponse');
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
  const table = await Table.create(req.body);
  return res.status(201).json({data: table});
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const tables = await Table.find();
  return res.status(200).json({data: tables});
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const table = await Table.findById(req.params.table_id);
  if (!table) {
    return next(new ErrorResponse(
      `Table not found with id of ${req.params.table_id}`,
      404
    ));
  }
  return res.status(200).json({data: table});
});

exports.update = asyncHandler(async (req, res, next) => {
  const table = await Table.findOneAndUpdate(
    { _id: req.params.table_id },
    { $set: req.body },
    { new: true },
    { runValidators: true }
  );
  if (!table) {
    return next(new ErrorResponse(
      `Table not found with id of ${req.params.table_id}`,
      404
    ));
  }
  return res.status(200).json({data: table});
});

exports.deleteOne = asyncHandler(async (req, res, next) => {
  const table = await Table.findById(req.params.table_id);
  if (!table) {
    return next(new ErrorResponse(
      `Table not found with id of ${req.params.table_id}`,
      404
    ));
  }
  await Table.deleteOne({ _id: req.params.table_id });
  return res.status(200).json({
    message: 'Table was deleted.',
  });
});
