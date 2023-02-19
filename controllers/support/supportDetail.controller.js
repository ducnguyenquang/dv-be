const Support = require("../../model/support");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const support = await Support.findOne({ _id: id });

    if (!support) {
      return res.status(404).send("Support not found");
    }

    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
}