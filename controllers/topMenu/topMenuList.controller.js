const TopMenu = require("../../model/top_menu");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
      isHidden,
    } = req.body;
    console.log('====topMenuList.controller req.body', req.body);

    const whereCondition = isHidden ? [{ [`${'isHidden'}`]: { $in: isHidden } }] : undefined;
    console.log('====topMenuList.controller whereCondition', whereCondition);
    const menu = await TopMenu.find(whereCondition ? { $and: whereCondition } : undefined)
      .limit(limit)
      .skip(offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, menu) {
        TopMenu.count().exec(function (err, count) {
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