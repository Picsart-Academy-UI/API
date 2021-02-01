const { Table } = require('booking-db');

const { NotFound } = require('../utils/errorResponse');
const { buildQuery, getPagination } = require('../utils/util');
<<<<<<< HEAD

const {createChairs} = require('../utils/createChairs');

=======
>>>>>>> 3801004d64cfa52b3ef3d161b443968fbddb9582
const { asyncHandler } = require('../middlewares/asyncHandler');
const { createChairs, deleteAllChairsInTable } = require('../utils/chairs-helper');

// @desc create table
// @route POST /api/v1/tables
// @access Private (Admin)
exports.create = asyncHandler(async (req, res, next) => {
  const table = await Table.create(req.body);
<<<<<<< HEAD
  const createdChairs = await createChairs(table);
=======
  await createChairs(table);
>>>>>>> 3801004d64cfa52b3ef3d161b443968fbddb9582
  return res.status(201).json({ data: table });
});

// @desc get all tables query
// @route GET /api/v1/tables/all
// @access Private (Admin)
exports.getAll = asyncHandler(async (req, res, next) => {
  const queryObject = buildQuery(req.query);
  const initialQuery = Table
    .find(queryObject)
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

// @desc get tables from the same team
// @route GET /api/v1/tables
// @access Private (User)
exports.getTables = asyncHandler(async (req, res, next) => {
  const tables = await Table
    .find({ team_id: req.user.team_id })
    .lean().exec();

  return res.status(200).json({
    data: tables,
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
