const Support = require("../../model/support");

module.exports = async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const support = await Support.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
}