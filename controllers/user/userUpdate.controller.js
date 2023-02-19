const User = require("../../model/user");

module.exports = async (req, res) => {
  try {
    const { _id, images } = req.body;

    let user = await User.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}