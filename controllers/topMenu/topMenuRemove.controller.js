const TopMenu = require("../../model/top_menu");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const menu = await TopMenu.findOneAndDelete({ _id });
    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}