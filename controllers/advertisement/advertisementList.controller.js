const Advertisement = require("../../model/advertisement");

module.exports = async (req, res) => {
  try {
    // Get advertisement input
    const {
      pagination: { limit, offset },
      sort,
      search,
    } = req.body;
    let whereCondition = undefined;
    if (search) {
      for (const [key, value] of Object.entries(search)) {
        if (value) {
          let $in, $regex;
          if (!whereCondition) whereCondition = [];

          let result = value;
          switch (key) {
            case "name":
            case "url":
              result = ".*" + result + ".*";
              $regex = result;
              whereCondition.push({ [`${key}`]: { $regex, $options: "i" } });
              break;
            case "isHidden":
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
            default:
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
          }
        }
      }
    }

    const advertisements = await Advertisement.find(whereCondition ? { $and: whereCondition } : undefined)
      .limit(limit)
      .skip(offset)
      .sort(sort)
      .exec(function (err, advertisements) {
        Advertisement.count().exec(function (err, count) {
          res.status(200).send({
            data: advertisements,
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
};