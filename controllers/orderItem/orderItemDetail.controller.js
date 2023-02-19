const OrderItem = require("../../model/order_item");

module.exports = async (req, res) => {
  try {
    // Get user input
    // req.query.id === 'red'
    const id = req.params.id;

    // const id = req.query.id
    const orderItem = await OrderItem.findOne({ _id: id })
      .populate(["order", "product"])
      .exec();

    if (!orderItem) {
      return res.status(404).send("Order item not found");
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
}