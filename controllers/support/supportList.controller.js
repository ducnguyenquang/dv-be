const Support = require("../../model/support");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const support = await Support.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, support) {
        Support.count().exec(function (err, count) {
          res.status(200).send({
            data: support,
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