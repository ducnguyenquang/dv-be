const Project = require("../../model/project");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldMenu = await Project.findOne({ name });
    if (oldMenu) {
      return res.status(409).send("Menu Already Exist.");
    }

    // Create category in our database
    let menu = await Project.create(req.body);

    menu = await Project.findOne({ _id: menu._id });

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}