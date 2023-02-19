const PopupMenu = require("../../model/popup_menu");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const menu = await PopupMenu.findOneAndDelete({ _id });
    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}