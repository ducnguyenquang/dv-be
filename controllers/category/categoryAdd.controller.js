const Category = require("../../model/category");

module.exports = async (req, res) => {
  try {
    const { slug } = req.body;
    const oldCategory = await Category.findOne({ slug });
    if (oldCategory) {
      return res.status(409).send("Category Already Exist.");
    }
    let category = await Category.create(req.body);
    category = await Category.findOne({ _id: category._id });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
}