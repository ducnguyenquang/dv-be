const Common = require("../../model/common");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const menu = await Common.findOneAndDelete({ _id });
    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}