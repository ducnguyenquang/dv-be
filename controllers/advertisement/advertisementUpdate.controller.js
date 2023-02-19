const Advertisement = require("../../model/advertisement");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const advertisement = await Advertisement.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
}