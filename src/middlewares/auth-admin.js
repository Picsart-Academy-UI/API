module.exports = async (req, res, next) => {
  const { user } = req;
  if (user && user.is_admin) {
    return next();
  }
  return next(new Error('Unauthorized'));
};
