const EmailTemplate = require("../../model/email_template");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldItem = await EmailTemplate.findOne({ name });
    if (oldItem) {
      return res.status(409).send("Email Template Already Exist.");
    }

    // Create emailTemplate in our database
    let emailTemplate = await EmailTemplate.create(req.body);

    // emailTemplate = await EmailTemplate.findOne({ _id: emailTemplate._id });

    res.status(200).json(emailTemplate);
  } catch (err) {
    console.log(err);
  }
}