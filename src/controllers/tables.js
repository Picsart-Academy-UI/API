const { Table } = require('booking-db');

const { NotFound } = require('../utils/errorResponse');
const { createChairs } = require('../utils/createChairs');
const { buildQuery, getPagination } = require('../utils/util');
<<<<<<< HEAD

const {createChairs} = require('../utils/createChairs');

=======
>>>>>>> 3801004d64cfa52b3ef3d161b443968fbddb9582
const { asyncHandler } = require('../middlewares/asyncHandler');

exports.create = asyncHandler(async (req, res, next) => {
  const table = await Table.create(req.body);
<<<<<<< HEAD
  const createdChairs = await createChairs(table);
=======
  await createChairs(table);
>>>>>>> 3801004d64cfa52b3ef3d161b443968fbddb9582
  return res.status(201).json({ data: table });
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const queryObject = buildQuery(req.query);
  const initialQuery = Table.find(queryObject).lean();

  const tables = await Table
    .find()
    .populate({ path: 'chairs', select: '_id number -table_id' })
    .lean()
    .exec();

  const count = await Table.countDocuments(queryObject);

  const { pagination } = getPagination(
    req.query.page, req.query.limit, count, req, initialQuery
  );

  return res.status(200).json({
    data: tables,
    count,
    pagination,
  });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const table = await Table
    .findById(req.params.table_id)
    .lean()
    .exec();

  if (!table) next(new NotFound());

  return res.status(200).json({ data: table });
});

exports.update = asyncHandler(async (req, res, next) => {
  const table = await Table.findByIdAndUpdate(
    { _id: req.params.table_id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!table) next(new NotFound());

  return res.status(200).json({ data: table });
});

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
