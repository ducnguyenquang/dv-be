const User = require("../../model/user");
const generatePassword = require("../../utils/generatePassword");
const sendEmail = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist.");
    }

    const password = generatePassword();

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    const userData = {
      ...req.body,
      password: encryptedPassword,
    };
    // Create user in our database
    let user = await User.create(req.body);

    res.status(200).json(user);

    sendEmail(
      {
        title: "Đăng ký thành công",
        content: `Đây là mật khẩu tạm thời của bạn [ ${password} ]`,
      },
      email
    );
  } catch (err) {
    console.log(err);
  }
}