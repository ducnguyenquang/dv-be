const TopMenu = require("../../model/top_menu");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const menu = await TopMenu.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
}