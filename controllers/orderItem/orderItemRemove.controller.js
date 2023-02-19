const OrderItem = require("../../model/order_item");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    let orderItem = await OrderItem.findOne({ _id: id });

    if (orderItem) {
      switch (orderItem.quantity) {
        case 1:
          orderItem = await OrderItem.findOneAndDelete({ _id: id });
          break;
        default:
          orderItem = await OrderItem.findOneAndUpdate(
            { _id: id },
            { quantity: orderItem.quantity - 1 }
          );
          break;
      }
      orderItem = await OrderItem.findOne({ _id: id })
        .populate(["order", "product"])
        .exec();
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
}