const Advertisement = require("../../model/advertisement");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldAdvertisement = await Advertisement.findOne({ name });
    if (oldAdvertisement) {
      return res.status(409).send("Advertisement Already Exist.");
    }

    // Create category in our database
    let advertisement = await Advertisement.create(req.body);

    advertisement = await Advertisement.findOne({ _id: advertisement._id });

    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
}