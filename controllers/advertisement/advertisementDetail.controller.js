const Advertisement = require("../../model/advertisement");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const advertisement = await Advertisement.findOne({ _id: id });

    if (!advertisement) {
      return res.status(404).send("advertisement not found");
    }

    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
}