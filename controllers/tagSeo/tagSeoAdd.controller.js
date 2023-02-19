const TagSeo = require("../../model/tag_seo");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldTagSeo = await TagSeo.findOne({ name });
    if (oldTagSeo) {
      return res.status(409).send("Tag Seo Already Exist.");
    }

    // Create category in our database
    let tagSeo = await TagSeo.create(req.body);

    tagSeo = await TagSeo.findOne({ _id: tagSeo._id });

    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
}