module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    return res.status(200).json(req.body);
  }
  const err = {
    msg: 'No email or password',
  };

  // TODO: create Error handlers
  return res.status(404).json(err);
};
