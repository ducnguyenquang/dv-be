const PopupMenu = require("../../model/popup_menu");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
      isHidden,
    } = req.body;
    const whereCondition = [{ [`${'isHidden'}`]: { $in: isHidden } }];
    const menu = await PopupMenu.find(whereCondition ? { $and: whereCondition } : undefined)
      .limit(limit)
      .skip(offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, menu) {
        PopupMenu.count().exec(function (err, count) {
          res.status(200).send({
            data: menu,
            pagination: {
              totalCount: count,
              currentPage: offset,
            },
          });
        });
      });
  } catch (err) {
    console.log(err);
  }
}