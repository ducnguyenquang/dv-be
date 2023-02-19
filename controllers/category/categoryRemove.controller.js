const Category = require("../../model/category");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const category = await Category.findOneAndDelete({ _id });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
}