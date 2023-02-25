const Project = require("../../model/project");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
      isHidden = false,
    } = req.body;

    const whereCondition = [{ [`${'isHidden'}`]: { $in: isHidden } }];
    const menu = await Project.find(whereCondition ? { $and: whereCondition } : undefined)
      .limit(limit)
      .skip(offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, menu) {
        Project.count().exec(function (err, count) {
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