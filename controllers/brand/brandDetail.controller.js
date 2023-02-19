const Brand = require("../../model/brand");

module.exports = async (req, res) => {
  try {
    const slug = req.params.id;
    const brand = await Brand.findOne({ slug });

    if (!brand) {
      return res.status(404).send("brand not found");
    }

    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
};