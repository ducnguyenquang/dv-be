const Project = require("../../model/project");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await Project.findOne({ _id: id });

    if (!menu) {
      return res.status(404).send("menu not found");
    }

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}