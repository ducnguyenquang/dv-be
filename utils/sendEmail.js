module.exports = function (emailTemplate, sendTo) {
  var nodemailer = require("nodemailer");
  const { SENDER, SENDER_P } = process.env;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER,
      pass: SENDER_P,
    },
  });

  const mailOptions = {
    // from: SENDER,
    from: "capdaiviet@gmail.com",
    to: sendTo,
    subject: emailTemplate?.title,
    text: emailTemplate?.content,
  };

  console.log("==== mailOptions", mailOptions);

  send();

  async function send() {
    const result = await transporter.sendMail(mailOptions);
    console.log("==== send result", result);

    console.log(JSON.stringify(result, null, 4));
  }
}