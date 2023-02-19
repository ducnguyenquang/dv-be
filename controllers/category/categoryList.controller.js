const Category = require("../../model/category");

module.exports = async (req, res) => {
  try {
    const {
      pagination: { limit, offset },
      sort,
      search,
    } = req.body;

    let whereCondition = undefined;
    if (search) {
      for (const [key, value] of Object.entries(search)) {
        if (value) {
          // let $or;
          let $in, $regex;
          if (!whereCondition) whereCondition = [];

          let result = value;
          switch (key) {
            case "name":
            case "slug":
              result = ".*" + result + ".*";
              $regex = result;
              whereCondition.push({ [`${key}`]: { $regex, $options: "i" } });
              break;
            default:
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
          }
        }
      }
    }

    const categories = await Category.find(
      whereCondition ? { $and: whereCondition } : undefined
    )
      .limit(limit)
      .skip(offset)
      .sort(sort)
      .populate([
        {
          path: "parentId",
          populate: ["category"],
        },
      ])
      .exec(function (err, categories) {
        Category.countDocuments(
          whereCondition ? { $and: whereCondition } : undefined
        ).exec(function (err, count) {
          res.status(200).send({
            data: categories || [],
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