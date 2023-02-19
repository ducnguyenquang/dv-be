const EmailTemplate = require("../../model/email_template");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;
    const emailTemplate = await EmailTemplate.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(emailTemplate);
  } catch (err) {
    console.log(err);
  }
}