const { User } = require('db_picsart');

module.exports = async (req, res) => {
  try {
    const { user_id } = req.params;
    const endpoint = req.body;

    const user = await User.findByIdAndUpdate(user_id,
      {
        $pull: {
          push_subscriptions: {
            endpoint
          }
        }
      },
      { new: true }).exec();
    console.log('Here');
    return res.status(200).json({user});
  } catch (e) {
    console.error(e);
  }
};
