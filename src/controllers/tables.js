const { Table } = require('booking-db');

const { NotFound } = require('../utils/errorResponse');
const { buildQuery, getPagination } = require('../utils/util');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { createChairs, deleteAllChairsInTable } = require('../utils/chairs-helper');

// @desc create table
// @route POST /api/v1/tables
// @access Private (Admin)
exports.create = asyncHandler(async (req, res, next) => {
  const table = await Table.create(req.body);
  await createChairs(table);
  return res.status(201).json({ data: table });
});

// @desc get all tables query
// @route GET /api/v1/tables/
// @access Private (Admin)
exports.getAll = asyncHandler(async (req, res, next) => {
  let queryObject = buildQuery(req.query);

  if (!req.user.is_admin) queryObject = { ...queryObject, team_id: req.user.team_id };

  const initialQuery = Table.find(queryObject)
    .populate({
      path: 'chairs',
      select: '_id chair_number -table_id'
    });

  const count = await Table.countDocuments(queryObject);

  const { pagination, query } = getPagination(
    req.query.page, req.query.limit, count, req, initialQuery
  );

  const tables = await query.lean().exec();

  return res.status(200).json({
    data: tables,
    count,
    pagination,
  });
});

// @desc get requested table
// @route GET /api/v1/tables/:table_id
// @access Private (Admin)
exports.getOne = asyncHandler(async (req, res, next) => {
  const table = await Table
    .findById(req.params.table_id)
    .lean()
    .exec();

  if (!table) next(new NotFound());

  return res.status(200).json({ data: table });
});

// @desc update requested table
// @route PUT /api/v1/tables/:table_id
// @access Private (Admin)
exports.update = asyncHandler(async (req, res, next) => {
  const table = await Table.findByIdAndUpdate(
    { _id: req.params.table_id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!table) next(new NotFound());

  await deleteAllChairsInTable(table);
  await createChairs(table);

  return res.status(200).json({ data: table });
});

// @desc delete requested table
// @route DELETE /api/v1/tables/:table_id
// @access Private (Admin)
exports.deleteOne = asyncHandler(async (req, res, next) => {
  const table = await Table
    .findById(req.params.table_id)
    .lean()
    .exec();

  if (!table) next(new NotFound());

  await Table.deleteOne({ _id: req.params.table_id });

  return res.status(200).json({
    message: 'Table was deleted.',
  });
});
