const Project = require("../../model/project");

module.exports = async (req, res) => {
  try {
    const slug = req.params.id;
    const menu = await Project.findOne({ slug: encodeURIComponent(slug) });

    if (!menu) {
      return res.status(404).send("Project not found");
    }

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
};
