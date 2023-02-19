const EmailTemplate = require("../../model/email_template");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const emailTemplate = await EmailTemplate.findOne({ _id: id });

    if (!emailTemplate) {
      return res.status(404).send("email Template not found");
    }

    res.status(200).json(emailTemplate);
  } catch (err) {
    console.log(err);
  }
}