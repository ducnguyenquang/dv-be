const Order = require("../../model/order");

module.exports = async (req, res) => {
  try {
    const orderNumber = req.params.id;
    console.log("==== /order/remove/:id orderNumber", orderNumber);
    const order = await Order.findOneAndDelete({ orderNumber });

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
}