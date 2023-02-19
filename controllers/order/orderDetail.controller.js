const Order = require("../../model/order");

module.exports = async (req, res) => {
  try {
    // Get user input
    // req.query.id === 'red'
    const orderNumber = req.params.id;

    // const id = req.query.id
    const order = await Order.findOne({ orderNumber })
      .populate([
        {
          path: "orderItems",
          populate: { path: "product" },
        },
        {
          path: "customer",
          populate: ["customer"],
        },
      ])
      .exec();

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
}