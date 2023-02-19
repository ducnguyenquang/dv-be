const Product = require("../../model/product");

module.exports = async (req, res) => {
  try {
    const {
      pagination: { limit, offset },
      sort,
      search,
    } = req.body;

    let whereCondition = undefined;
    let wherePopulate = undefined;
    if (search) {
      for (const [key, value] of Object.entries(search)) {
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
            case "brand":
              result = new ObjectId(result);
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
            case "isHidden":
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
            default:
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              wherePopulate = result;
              break;
          }
      }
    }
    await Product.find(whereCondition ? { $and: whereCondition } : undefined)
      // await Product.find()
      .limit(limit)
      .skip(offset)
      .sort(sort)
      .populate([
        {
          path: "brand",
          populate: ["brand"],
        },
        [
          {
            path: "categories",
            // populate: ["category"],
            populate: { path: "category" },
          },
        ],
      ])
      // .find(whereCondition ? { $and: whereCondition } : undefined)
      .exec(function (err, products) {
        // console.log("==== products", products);

        // products = products.filter((product) => {
        //   return product.categories.filter(category => category.slug === wherePopulate.slug);
        // });
        // console.log("==== products 1", products.length);

        Product.countDocuments(
          whereCondition ? { $and: whereCondition } : undefined
        ).exec(function (err, count) {
          res.status(200).send({
            data: products || [],
            pagination: {
              // totalCount: count,
              // offset: offset,
              // hasPreviousPage: offset * limit > 0,
              // hasNextPage: offset * limit <= count,
              // count: limit,
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