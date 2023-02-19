const Order = require("../../model/order");

module.exports = async (req, res) => {
  try {
    const { limit, offset } = req.body;
    const orders = await Order.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        email: "asc",
      })
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
      .exec(function (err, orders) {
        Order.count().exec(function (err, count) {
          res.status(200).send({
            data: orders,
            pagination: {
              totalCount: count,
              currentPage: offset,
            },
          });
        });
      });
  } catch (err) {
    console.log(err);
  }
}