const User = require("../../model/user");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}