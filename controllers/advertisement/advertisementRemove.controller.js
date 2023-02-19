const Advertisement = require("../../model/advertisement");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    // const { name, slug, description } = req.body;
    const advertisement = await Advertisement.findOneAndDelete({ _id });
    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
}