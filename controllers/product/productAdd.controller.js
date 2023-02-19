const Product = require("../../model/product");

module.exports = async (req, res) => {
  try {
    const { slug } = req.body;
    const oldProduct = await Product.findOne({ slug });

    if (oldProduct) {
      return res.status(409).send("Product Already Exist.");
    }
    let product = await Product.create(req.body);

    product = await Product.findOne({ _id: product._id })
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