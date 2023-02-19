const Brand = require("../../model/brand");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const brand = await Brand.findOneAndDelete({ _id });
    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
};