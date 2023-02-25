const Common = require("../../model/common");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;
    const menu = await Common.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}