const {
  Team, Reservation
} = require('booking-db');

const { asyncHandler } = require('../middlewares/asyncHandler');

const getAnalyticsData = async (timeInterval) => {
  let milliseconds = 0;
  switch (timeInterval) {
    case 'day': {
      milliseconds = 86400000;
      break;
    }
    case 'week': {
      milliseconds = 604800000;
      break;
    }
    case 'month': {
      milliseconds = 2592000000;
      break;
    }
    default: milliseconds = 0;
  }

  const analyticsInfo = [];
  const teams = await Team.find({}).populate({path: 'members_count'}).lean().exec();

  for (const team of teams) {
    const reservations = await Reservation.find({
      team_id: team._id,
      status: 'approved',
      start_date: {
        $gte: new Date(Date.now() - milliseconds),
        $lte: new Date()
      }
    }).lean().exec();

    if (team.members_count) {
      analyticsInfo.push({
        team: team.team_name,
        members_count: team.members_count,
        reservations
      });
    }
  }
  return analyticsInfo;
};

module.exports = {
  getAnalyticsForDay: asyncHandler(async (req, res) => {
    const analyticsInfo = await getAnalyticsData('day');
    res.json(analyticsInfo);
  }),
  getAnalyticsForWeek: asyncHandler(async (req, res) => {
    const analyticsInfo = await getAnalyticsData('week');
    res.json(analyticsInfo);
  }),
  getAnalyticsForMonth: asyncHandler(async (req, res) => {
    const analyticsInfo = await getAnalyticsData('month');
    res.json(analyticsInfo);
  })
};
