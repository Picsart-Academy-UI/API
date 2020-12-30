const { Reservation } = require('db_picsart');

exports.create = async (req, res, next) => {
  const {
    table_id, chair_id, team_id, date_start, date_end,
  } = req.body;

  if (!table_id || !chair_id || !team_id || !date_start || !date_end) {
    return res.status(400).json({
      errMsg: 'Please fill the required fields',
    });
  }

  const reservation = new Reservation({
    table_id,
    chair_id,
    team_id,
    date_start,
    date_end,
  });

  try {
    await reservation.save();
    return res.status(201).json(reservation);
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  const {
    table_id, chair_id, team_id, date_start, date_end,
  } = req.body;
  const { reservation_id } = req.params;

  if (!table_id || !chair_id || !team_id) {
    return res.status(400).json({
      errMsg: 'Please fill the required fields',
    });
  }

  const updated = {
    table_id,
    chair_id,
    team_id,
  };

  if (date_start) updated.date_start = date_start;
  if (date_end) updated.date_end = date_end;

  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.reservation_id },
      { $set: updated },
      { new: true },
    );
    return res.status(200).json(reservation);
  } catch (err) {
    return next(err);
  }
};

exports.get = async (req, res, next) => {
  const queries = req.query;

  try {
    const reservations = await Reservation.find(queries);

    return res.status(200).json(reservations);
  } catch (err) {
    return next(err);
  }
};

exports.getOne = async (req, res, next) => {
  const { reservation_id } = req.params;

  if (!reservation_id) {
    return res.status(400).json({
      errMsg: 'Please provide a reservation id',
    });
  }

  try {
    const reservation = await Reservation.findById(reservation_id);

    return res.status(200).json(reservation);
  } catch (err) {
    return next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Reservation.deleteMany();
    return res.status(200).json({
      msg: 'All reservations were deleted',
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  const { reservation_id } = req.params;

  try {
    await Reservation.deleteOne({ _id: reservation_id });
    return res.status(200).json({
      msg: 'Reseravtion was deleted',
    });
  } catch (err) {
    return next(err);
  }
};
