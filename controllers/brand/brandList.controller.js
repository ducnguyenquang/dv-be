const Brand = require("../../model/brand");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const brands = await Brand.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, brands) {
        Brand.count().exec(function (err, count) {
          res.status(200).send({
            data: brands,
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
};