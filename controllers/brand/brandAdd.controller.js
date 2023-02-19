const Brand = require("../../model/brand");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name, slug, description, logo } = req.body;

    // Validate if user exist in our database
    const oldBrand = await Brand.findOne({ slug });
    if (oldBrand) {
      return res.status(409).send("Brand Already Exist.");
    }

    // Create category in our database
    let brand = await Brand.create(req.body);

    brand = await Brand.findOne({ _id: brand._id });

    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
};