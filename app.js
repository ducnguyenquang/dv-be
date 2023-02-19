require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
// const User = require("./model/user");
// const Category = require("./model/category");
// const Product = require("./model/product");
// const Order = require("./model/order");
// const Customer = require("./model/customer");
// const OrderItem = require("./model/order_item");
// const Brand = require("./model/brand");
// const Advertisement = require("./model/advertisement");
// const EmailTemplate = require("./model/email_template");
// const PopupMenu = require("./model/popup_menu");
// const TagSeo = require("./model/tag_seo");
// const Support = require("./model/support");
// const escapeStringRegexp = require('escape-string-regexp');
const ObjectId = require("mongoose").Types.ObjectId;
const bp = require('body-parser')

const multer = require("multer");
const domainsFromEnv = process.env.CORS_DOMAINS || "";
const whitelist = domainsFromEnv.split(",").map((item) => item.trim());

const auth = require("./middleware/auth");



// function generatePassword() {
//   var length = 8,
//     charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//     retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//     retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// }

// function sendEmail(emailTemplate, sendTo) {
//   var nodemailer = require("nodemailer");
//   const { SENDER, SENDER_P } = process.env;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: SENDER,
//       pass: SENDER_P,
//     },
//   });

//   const mailOptions = {
//     // from: SENDER,
//     from: "capdaiviet@gmail.com",
//     to: sendTo,
//     subject: emailTemplate?.title,
//     text: emailTemplate?.content,
//   };

//   console.log("==== mailOptions", mailOptions);

//   send();

//   async function send() {
//     const result = await transporter.sendMail(mailOptions);
//     console.log("==== send result", result);

//     console.log(JSON.stringify(result, null, 4));
//   }
// }

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      "http://localhost:4001",
      "http://localhost:8080",
      "http://localhost:3000",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:4001",
      "http://103.15.51.185",
      "http://103.15.51.185:8080",
      "http://103.15.51.185:4001",
      "https://leddaiviet.com",
      "https://leddaiviet.com:8080",
      "https://leddaiviet.com:4001",
      "http://leddaiviet.com",
      "http://leddaiviet.com:8080",
      "http://leddaiviet.com:4001",
      "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop",
    ];

    // console.log("==== corsOptions origin", origin);

    if (!origin || whitelist.indexOf(origin) !== -1) {
    // if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};


const app = express();
// app.use(cors({
//   origin: '*'
// }));

// app.use(cors())

// app.use((request, response, next) => {
//   response.set('Referrer-Policy', 'no-referrer');
//   next();
// })

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(cors(corsOptions));

const userRouter = require('./routers/user');
const categoryRouter = require('./routers/category');
const productRouter = require('./routers/product');
const advertisementRouter = require('./routers/advertisement');
const brandRouter = require('./routers/brand');
const emailTemplateRouter = require('./routers/emailTemplate');
const orderRouter = require('./routers/order');
const orderItemRouter = require('./routers/orderItem');
const popMenuRouter = require('./routers/popMenu');
const supportRouter = require('./routers/support');
const tagSeoRouter = require('./routers/tagSeo');
const userUtilsRouter = require('./routers/userUtils');
const utilsRouter = require('./routers/utils');

app.use(userRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(advertisementRouter);
app.use(brandRouter);
app.use(emailTemplateRouter);
app.use(orderRouter);
app.use(orderItemRouter);
app.use(popMenuRouter);
app.use(supportRouter);
app.use(tagSeoRouter);
app.use(userUtilsRouter);
app.use(utilsRouter);

app.get("/", function (req, res, next) {
  // Handle the get for this route
  console.log("==== / Daiviet index");
  res.status(200)
});

app.post("/", function (req, res, next) {
  // Handle the post for this route
});

app.use(express.json({ limit: "50mb" }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

// Define the maximum size for uploading
// picture i.e. 10 MB. it is optional
const maxSize = 1 * 1000 * 1000 * 10;

const upload = multer({ dest: "uploads/" });

// app.post("/register", async (req, res) => {
//   try {
//     // Get user input
//     const { firstName, lastName, email, phone } = req.body;

//     // Validate user input
//     if (!(email && firstName && lastName)) {
//       res.status(400).send("All input is required");
//     }

//     // check if user already exist
//     // Validate if user exist in our database
//     const oldUser = await User.findOne({ email });

//     if (oldUser) {
//       return res.status(409).send("User Already Exist. Please Login");
//     }

//     const randomPassword = crypto.randomBytes(5).toString("hex");

//     //Encrypt user password
//     encryptedPassword = await bcrypt.hash(randomPassword, 10);

//     // Create user in our database
//     let user = await User.create({
//       ...req.body,
//       email: email.toLowerCase(), // sanitize: convert email to lowercase
//       password: encryptedPassword,
//       status: "NEW",
//     });

//     if (user.status === "CHANGED_PASSWORD") {
//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );
//       // save user token
//       user.token = token;
//     }
//     user.password = undefined;

//     sendEmail(
//       {
//         title: "[leddaiviet.com] Đăng ký tài khoản thành công",
//         content: `Đây là mật khẩu đăng nhập của bạn [ ${randomPassword} ]`,
//       },
//       user.email
//     );

//     // return new user
//     res.status(200).json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     // Get user input
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     let user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // const result = { ...user }
//       if (user.status === "CHANGED_PASSWORD") {
//         // Create token
//         const token = jwt.sign(
//           { user_id: user._id, email },
//           process.env.TOKEN_KEY,
//           {
//             expiresIn: "2h",
//           }
//         );

//         // save user token
//         user.token = token;
//       } else {
//         //Encrypt user password
//         // const temporaryPassword = await bcrypt.hash(password, 10);
//         user.temporaryToken = user.password;
//       }
//       user.password = undefined;
//       console.log("==== /login result", user);
//       res.status(200).json(user);
//     }
//     res.status(400).send("Tài khoản không tồn tại");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/changePassword", async (req, res) => {
//   try {
//     // Get user input
//     const { email, password, oldPassword } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     const user = await User.findOne({ email });
//     // console.log("==== email", email);
//     // console.log("==== password", password);
//     // console.log("==== user", user);

//     if (user && oldPassword === user.password) {
//       //Encrypt user password
//       const encryptedPassword = await bcrypt.hash(password, 10);

//       await User.findByIdAndUpdate(user._id, {
//         password: encryptedPassword,
//         status: "CHANGED_PASSWORD",
//       });

//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );

//       // save user token
//       user.token = token;
//       user.password = undefined;
//       res.status(200).json(user);
//     }
//     res.status(400).send("Tài khoản không tồn tại");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/sendEmail", auth, (req, res) => {
//   var nodemailer = require("nodemailer");
//   const { SENDER, SENDER_P } = process.env;

//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: SENDER,
//       pass: SENDER_P,
//     },
//   });

//   var mailOptions = {
//     from: SENDER,
//     to: "mr.nguyenquangduc@gmail.com",
//     subject: "Sending Email using Node.js",
//     text: "That was easy!",
//   };

//   send();

//   async function send() {
//     const result = await transporter.sendMail(mailOptions);

//     console.log(JSON.stringify(result, null, 4));
//   }

//   res.status(200).send("Sent email ... ");
// });

// app.post("/upload", auth, async (req, res) => {
//   // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

//   try {
//     const { _id, images } = req.body;
//     // console.log("==== req.body", req.body);

//     // let product = null;
//     upload(req, res, async function (err) {
//       if (err) {
//         // ERROR occurred (here it can be occurred due
//         // to uploading image of size greater than
//         // 1MB or uploading different file type)
//         console.log("==== upload err", err);

//         res.send(err);
//       } else {
//         // SUCCESS, image successfully uploaded
//         // res.send("Success, Image uploaded!");
//         console.log("==== upload req", req);
//         // return await Product.findOneAndUpdate(
//         //   { _id },
//         //   {
//         //     ...req.body,
//         //     updatedAt: Date.now(),
//         //   }
//         // );
//       }
//     });

//     // product = await Product.findOne({ _id: product._id })
//     //   .populate("categories")
//     //   .exec();

//     // console.log('==== product/update', product)

//     // res.status(200).json(product);
//   } catch (err) {
//     console.log(err);
//   }
// });

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(200).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
  // res.status(404).json({
  //   success: "false",
  //   message: "Page not found",
  //   error: {
  //     statusCode: 404,
  //     message: "You reached a route that is not defined on this server",
  //   },
  // });
});

module.exports = app;
