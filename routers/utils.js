const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const User = require("../model/user");
const sendEmail = require("../utils/sendEmail");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


app.get("/sendEmail", auth, (req, res) => {
  var nodemailer = require("nodemailer");
  const { SENDER, SENDER_P } = process.env;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER,
      pass: SENDER_P,
    },
  });

  var mailOptions = {
    from: SENDER,
    to: "mr.nguyenquangduc@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  send();

  async function send() {
    const result = await transporter.sendMail(mailOptions);

    console.log(JSON.stringify(result, null, 4));
  }

  res.status(200).send("Sent email ... ");
});

app.post("/upload", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id, images } = req.body;
    // console.log("==== req.body", req.body);

    // let product = null;
    upload(req, res, async function (err) {
      if (err) {
        // ERROR occurred (here it can be occurred due
        // to uploading image of size greater than
        // 1MB or uploading different file type)
        console.log("==== upload err", err);

        res.send(err);
      } else {
        // SUCCESS, image successfully uploaded
        // res.send("Success, Image uploaded!");
        console.log("==== upload req", req);
        // return await Product.findOneAndUpdate(
        //   { _id },
        //   {
        //     ...req.body,
        //     updatedAt: Date.now(),
        //   }
        // );
      }
    });

    // product = await Product.findOne({ _id: product._id })
    //   .populate("categories")
    //   .exec();

    // console.log('==== product/update', product)

    // res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

module.exports = app
