const Support = require("../../model/support");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const support = await Support.findOneAndDelete({ _id });
    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
}