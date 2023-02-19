const TagSeo = require("../../model/tag_seo");

module.exports = async (req, res) => {
  try {
    const slug = req.params.id;
    const tagSeo = await TagSeo.findOne({ slug });

    if (!tagSeo) {
      return res.status(404).send("tagSeo not found");
    }

    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
}