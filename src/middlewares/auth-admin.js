module.exports = async (req, res, next) => {
  if (req.use.is_admin) {
    return next();
  }
  return next(new Error('Unauthorized'));
};
