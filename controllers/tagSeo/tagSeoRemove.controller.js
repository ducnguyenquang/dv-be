const TagSeo = require("../../model/tag_seo");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const tagSeo = await TagSeo.findOneAndDelete({ _id });
    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
}