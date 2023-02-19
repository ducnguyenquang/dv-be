const Product = require("../../model/product");

module.exports = async (req, res) => {
  try {
    const slug = req.params.id;
    const product = await Product.findOne({
      slug: encodeURIComponent(slug),
    })
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

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
};