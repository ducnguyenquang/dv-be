const Order = require("../../model/order");
const OrderItem = require("../../model/order_item");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { limit, page, orderNumber } = req.body;
    const order = await Order.findOne({ orderNumber });

    const orderItems = await OrderItem.find({ order: order._id })
      .limit(limit)
      .skip(limit * page)
      .sort({
        email: "asc",
      })
      .populate(["order", "product"])
      .exec();

    // if (products) {
    //   return res.status(404).send("Products not found");
    // }

    res.status(200).json(orderItems);
  } catch (err) {
    console.log(err);
  }
}