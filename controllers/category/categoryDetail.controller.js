const Category = require("../../model/category");

module.exports = async (req, res) => {
  try {
    const slug = req.params.id;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
}