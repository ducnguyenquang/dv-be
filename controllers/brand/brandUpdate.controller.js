const Brand = require("../../model/brand");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;
    const brand = await Brand.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
};