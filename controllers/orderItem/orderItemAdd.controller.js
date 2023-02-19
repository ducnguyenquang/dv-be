const OrderItem = require("../../model/order_item");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { quantity, total, order, product } = req.body;

    let orderItem = await OrderItem.findOne({ order, product });

    if (orderItem) {
      // return res.status(404).send("Order Already Exist.");
      orderItem = await OrderItem.findOneAndUpdate(
        { order, product },
        { quantity: orderItem.quantity + 1 }
      );
    } else {
      // Create user in our database
      orderItem = await OrderItem.create({
        ...req.body,
      });
    }

    orderItem = await OrderItem.findOne({ _id: orderItem._id })
      .populate(["order", "product"])
      .exec();

    res.status(201).json(orderItem);
  } catch (err) {
    console.log(err);
  }
}