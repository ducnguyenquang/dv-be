const EmailTemplate = require("../../model/email_template");

module.exports = async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const emailTemplate = await EmailTemplate.find()
      .limit(limit)
      .skip(offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, emailTemplate) {
        EmailTemplate.count().exec(function (err, count) {
          res.status(200).send({
            data: emailTemplate,
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