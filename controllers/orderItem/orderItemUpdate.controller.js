const OrderItem = require("../../model/order_item");

module.exports = async (req, res) => {
  try {
    const { id } = req.body;
    let orderItem = await OrderItem.findOneAndUpdate({ _id: id }, req.body);
    if (orderItem) {
      orderItem = await OrderItem.findOne({ _id: orderItem._id })
        .populate(["order", "product"])
        .exec();
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
}