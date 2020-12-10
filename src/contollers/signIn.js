const { asyncHandler } = require('../middlewares');

module.exports = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    return res.status(200).json(req.body);
  } else {
    const err = {
      msg: 'No email or password'
    };

    //TODO: create Error handlers
    return res.status(404).json(err);
  }
});
