const Support = require("../../model/support");

module.exports = async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { name, phone, title } = req.body;

    // Validate if user exist in our database
    const oldSupport = await Support.findOne({ name, phone, title });
    if (oldSupport) {
      return res.status(409).send("support Already Exist.");
    }

    // Create category in our database
    let support = await Support.create(req.body);

    support = await Support.findOne({ _id: support._id });

    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
}