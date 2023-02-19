const TagSeo = require("../../model/tag_seo");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const tagSeo = await TagSeo.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
}