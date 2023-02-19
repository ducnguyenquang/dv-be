const { Router } = require('express');
const app = Router();
// const auth = require("../middleware/auth");
const User = require("../model/user");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, email, phone } = req.body;

    // Validate user input
    if (!(email && firstName && lastName)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // const randomPassword = crypto.randomBytes(5).toString("hex");

    const password = generatePassword();

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    let user = await User.create({
      ...req.body,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      status: "NEW",
    });

    if (user.status === "CHANGED_PASSWORD") {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
    }
    user.password = undefined;

    sendEmail(
      {
        title: "[leddaiviet.com] Đăng ký tài khoản thành công",
        content: `Đây là mật khẩu đăng nhập của bạn [ ${password} ]`,
      },
      user.email
    );

    // return new user
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // const result = { ...user }
      if (user.status === "CHANGED_PASSWORD") {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;
      } else {
        //Encrypt user password
        // const temporaryPassword = await bcrypt.hash(password, 10);
        user.temporaryToken = user.password;
      }
      user.password = undefined;
      console.log("==== /login result", user);
      res.status(200).json(user);
    }
    res.status(400).send("Tài khoản không tồn tại");
  } catch (err) {
    console.log(err);
  }
});

app.post("/changePassword", async (req, res) => {
  try {
    // Get user input
    const { email, password, oldPassword } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    // console.log("==== email", email);
    // console.log("==== password", password);
    // console.log("==== user", user);

    if (user && oldPassword === user.password) {
      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(user._id, {
        password: encryptedPassword,
        status: "CHANGED_PASSWORD",
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }
    res.status(400).send("Tài khoản không tồn tại");
  } catch (err) {
    console.log(err);
  }
});

module.exports = app
