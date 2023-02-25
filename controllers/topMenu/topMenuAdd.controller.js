const TopMenu = require("../../model/top_menu");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldMenu = await TopMenu.findOne({ name });
    console.log('==== topMenuAdd.controller req.body', req.body);
    if (oldMenu) {
      return res.status(409).send("Menu Already Exist.");
    }

    // Create category in our database
    let menu = await TopMenu.create(req.body);

    menu = await TopMenu.findOne({ _id: menu._id });

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}