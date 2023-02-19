const Project = require("../../model/project");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const menu = await Project.findOneAndDelete({ _id });
    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}