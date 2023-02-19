const Order = require("../../model/order");

module.exports = async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { orderNumber } = req.body;
    let order = await Order.findOneAndUpdate({ orderNumber }, req.body);
    order = await Order.findOne({ _id: order._id })
      .populate([
        {
          path: "orderItems",
          populate: ["order_item"],
        },
        {
          path: "customer",
          populate: ["customer"],
        },
      ])
      .exec();

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
}