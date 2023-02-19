const User = require("../../model/user");

module.exports = async (req, res) => {
  try {
    // Get user input
    const _id = req.params.id;
    const user = await User.findOne({
      _id,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}