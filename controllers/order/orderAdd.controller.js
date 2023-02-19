const Order = require("../../model/order");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { customer, orderItems } = req.body;
    const id = crypto.randomBytes(5).toString("hex");
    let order = await Order.findOne({ orderNumber: id });

    if (order) {
      return res.status(404).send("Order Already Exist.");
    }

    const customerData = await Customer.create(customer);
    const orderItemData = await OrderItem.create(orderItems);
    // Create user in our database
    order = await Order.create({
      ...req.body,
      customer: customerData._id,
      orderNumber: id,
      orderItems: orderItemData.map((item) => item._id),
      // createdBy: req.user.user_id,
    });

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

    sendEmail(
      {
        title: "Đặt hàng thành công",
        content: `"Đây là mã đơn hàng của bạn [ ${id} ]`,
      },
      customerData.email
    );

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
}