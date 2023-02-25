const Common = require("../../model/common");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name, type, group } = req.body;

    // Validate if user exist in our database
    const oldMenu = await Common.findOne({ name, type, group });
    if (oldMenu) {
      return res.status(409).send("Item Already Exist.");
    }

    // Create category in our database
    let menu = await Common.crea(req.body);

    menu = await Common.findOne({ _id: menu._id });

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}