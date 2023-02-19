const EmailTemplate = require("../../model/email_template");

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    // const { name, slug, description } = req.body;
    const emailTemplate = await EmailTemplate.findOneAndDelete({ _id });
    res.status(200).json(emailTemplate);
  } catch (err) {
    console.log(err);
  }
}