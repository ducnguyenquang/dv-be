const User = require("../../model/user");

module.exports = async (req, res) => {
  try {
    // Get user input
    const {
      pagination: { limit, offset },
    } = req.body;
    const users = await User.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        firstName: "asc",
      })
      .exec(function (err, users) {
        User.count().exec(function (err, count) {
          res.status(200).send({
            data: users,
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