const Product = require("../../model/product");

module.exports = async (req, res) => {
  try {
    const { _id, images } = req.body;
    let product = await Product.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    )
      .populate([
        {
          path: "brand",
          populate: ["brand"],
        },
        [
          {
            path: "categories",
            populate: ["category"],
          },
        ],
      ])
      .exec();

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
};