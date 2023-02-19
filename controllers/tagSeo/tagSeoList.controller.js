const TagSeo = require("../../model/tag_seo");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const tagSeo = await TagSeo.find()
      // .limit(limit)
      // .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, tagSeo) {
        TagSeo.count().exec(function (err, count) {
          res.status(200).send({
            data: tagSeo,
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