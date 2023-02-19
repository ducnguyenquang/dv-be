const Advertisement = require("../../model/advertisement");

module.exports = async (req, res) => {
  try {
    // Get advertisement input
    const {
      pagination: { limit, offset },
    } = req.body;

    const advertisements = await Advertisement.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, advertisements) {
        Advertisement.count().exec(function (err, count) {
          res.status(200).send({
            data: advertisements,
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