const Common = require("../../model/common");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const menu = await Common.findOne({ _id });

    if (!menu) {
      return res.status(404).send("item not found");
    }

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
};
