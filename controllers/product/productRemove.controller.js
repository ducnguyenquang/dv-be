const Product = require("../../model/product");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id });

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
};