const Category = require("../../model/category");

module.exports = async (req, res) => {
  try {
    const { _id, slug } = req.body;
    const oldCategory = await Category.findOne({ slug });
    if (oldCategory && oldCategory.slug !== slug) {
      return res.status(409).send("Category Already Exist.");
    }

    const category = await Category.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
}