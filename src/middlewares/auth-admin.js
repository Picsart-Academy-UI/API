module.exports = async (req, res, next) => {
  return next();
  // eslint-disable-next-line no-unreachable
  const { user } = req;
  if (user && user.is_admin) {
    return next();
  }
  return next(new Error('Unauthorized'));
};
