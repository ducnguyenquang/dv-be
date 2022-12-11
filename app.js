require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
const User = require("./model/user");
const Category = require("./model/category");
const Product = require("./model/product");
const Order = require("./model/order");
const Customer = require("./model/customer");
const OrderItem = require("./model/order_item");
const Brand = require("./model/brand");
const Advertisement = require("./model/advertisement");
const EmailTemplate = require("./model/email_template");
const PopupMenu = require("./model/popup_menu");
const TagSeo = require("./model/tag_seo");
const Support = require("./model/support");
// const escapeStringRegexp = require('escape-string-regexp');
const ObjectId = require("mongoose").Types.ObjectId;

const multer = require("multer");
const domainsFromEnv = process.env.CORS_DOMAINS || "";
const whitelist = domainsFromEnv.split(",").map((item) => item.trim());

const auth = require("./middleware/auth");

const app = express();

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function sendEmail(emailTemplate, sendTo) {
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
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", function (req, res, next) {
  // Handle the get for this route
  console.log("==== / Daiviet index");
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

    const randomPassword = crypto.randomBytes(5).toString("hex");

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(randomPassword, 10);

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
        content: `Đây là mật khẩu đăng nhập của bạn [ ${randomPassword} ]`,
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

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

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

//=== User ===
app.post("/user/list", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const {
      pagination: { limit, offset },
    } = req.body;
    const users = await User.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        firstName: "asc",
      })
      // .populate("categories")
      .exec(function (err, users) {
        User.count().exec(function (err, count) {
          res.status(200).send({
            data: users,
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
});

app.get("/user/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    const _id = req.params.id;
    // const category = req.params.category;
    // req.query.id === 'red'

    // console.log("==== req.params", req.params);
    // const categoryData = await Category.findOne({ slug: category });
    // console.log("==== categoryData", categoryData);

    // const id = req.query.id
    const user = await User.findOne({
      _id,
      // categories: categoryData._id,
    });
    // .populate("categories")
    // .exec();
    // console.log("==== product", product);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/user/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { email } = req.body;

    // // Validate if user exist in our database
    const oldUser = await Product.findOne({ email });

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
});

app.post("/user/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id, images } = req.body;
    // console.log("==== req.body", req.body);

    let user = await User.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );
    // .populate("categories")
    // .exec();

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/remove/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // const sku = req.params.id;
    console.log("===== /user/remove", req.params);
    const user = await User.findOneAndDelete({ _id: id });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});
//=== Category ===
app.post("/category/list", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const {
      pagination: { limit, offset },
      sort,
      search,
    } = req.body;

    const whereCondition = {};
    if (search) {
      for (const [key, value] of Object.entries(search)) {
        whereCondition[key] = {
          $options: "i",
          $regex: value,
        };
        // console.log(`${key}: ${value}`);
      }
    }

    const categories = await Category.find()
      .limit(limit)
      .skip(limit * offset)
      .where(whereCondition)
      .sort({
        name: "asc",
      })
      .populate([
        {
          path: "parentId",
          populate: ["category"],
        },
      ])
      .exec(function (err, categories) {
        Category.count().exec(function (err, count) {
          res.status(200).send({
            data: categories,
            pagination: {
              totalCount: count,
              currentPage: offset,
            },
          });
        });
      });
    // console.log("==== categories", categories);
    // if (!categories) {
    //   return res.status(404).send("Categories not found");
    // }

    // res.status(200).json(categories);
  } catch (err) {
    console.log(err);
  }
});

app.get("/category/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    // console.log("==== req", req);

    const slug = req.params.id;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});

app.post("/category/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { slug } = req.body;

    // Validate if user exist in our database
    const oldCategory = await Category.findOne({ slug });
    if (oldCategory) {
      return res.status(409).send("Category Already Exist.");
    }

    // Create category in our database
    let category = await Category.create(req.body);

    category = await Category.findOne({ _id: category._id });

    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});

app.post("/category/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id, slug } = req.body;
    // console.log("==== /category/update");

    // // Validate if user exist in our database
    const oldCategory = await Category.findOne({ slug });
    if (oldCategory && oldCategory.slug !== slug) {
      return res.status(409).send("Category Already Exist.");
    }

    const category = await Category.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});

app.get("/category/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const { name, slug, description } = req.body;
    const category = await Category.findOneAndDelete({ _id });
    // console.log("==== /category/remove/:id category", category);
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});
//=== Product ===
app.post("/product/list", async (req, res) => {
  try {
    // Get user input
    const {
      pagination: { limit, offset },
      sort,
      search,
    } = req.body;

    let whereCondition = undefined;
    if (search) {
      console.log('==== /product/list search', search);
      for (const [key, value] of Object.entries(search)) {
        if (value) {
          // let $or;
          let $in, $regex;
          if (!whereCondition) whereCondition = [];

          let result = value;
          switch (key) {
            case "name":
            case "slug":
              result = '.*' + result + '.*'
              $regex = result
              whereCondition.push({ [`${key}`]: { $regex, $options: 'i' } });
              break;
            case "brand":
              result = new ObjectId(result)
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
            default:
              $in = result;
              whereCondition.push({ [`${key}`]: { $in } });
              break;
          }
        }
      }
    }
    console.log('==== whereCondition', whereCondition);
    await Product.find(whereCondition ? { $and: whereCondition } : undefined)
      .limit(limit)
      .skip(offset)
      .sort(sort)
      .populate([
        {
          path: "brand",
          populate: ["brand"],
        },
        [
          {
            path: "categories",
            populate: ["category"],
          },
        ],
      ])
      .exec(function (err, products) {
        Product.countDocuments(
          whereCondition ? { $and: whereCondition } : undefined
        ).exec(function (err, count) {
          res.status(200).send({
            data: products || [],
            pagination: {
              // totalCount: count,
              // offset: offset,
              // hasPreviousPage: offset * limit > 0,
              // hasNextPage: offset * limit <= count,
              // count: limit,
              totalCount: count,
              currentPage: offset,
            },
          });
        });
      });
  } catch (err) {
    console.log(err);
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const slug = req.params.id;
    const product = await Product.findOne({
      slug: encodeURIComponent(slug),
    })
      .populate([
        {
          path: "brand",
          populate: ["brand"],
        },
        [
          {
            path: "categories",
            populate: ["category"],
          },
        ],
      ])
      .exec();

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

app.post("/product/add", auth, async (req, res) => {
  try {
    // Get user input
    const { slug } = req.body;

    // // Validate if user exist in our database
    const oldProduct = await Product.findOne({ slug });

    if (oldProduct) {
      return res.status(409).send("Product Already Exist.");
    }

    // Create user in our database
    let product = await Product.create(req.body);

    product = await Product.findOne({ _id: product._id })
      .populate([
        {
          path: "brand",
          populate: ["brand"],
        },
        [
          {
            path: "categories",
            populate: ["category"],
          },
        ],
      ])
      .exec();

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

app.post("/product/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id, images } = req.body;
    console.log("==== /product/update req.body", req.body);

    let product = await Product.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    )
      .populate([
        {
          path: "brand",
          populate: ["brand"],
        },
        [
          {
            path: "categories",
            populate: ["category"],
          },
        ],
      ])
      .exec();

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

app.get("/product/remove/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // const sku = req.params.id;
    console.log("===== /product/remove", req.params);
    const product = await Product.findOneAndDelete({ _id: id });

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});
//=== Order ===
app.post("/order/list", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // console.log('===== login req', req);
    // Get user input
    const { limit, offset } = req.body;
    const orders = await Order.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        email: "asc",
      })
      .populate([
        {
          path: "orderItems",
          populate: ["order_item"],
        },
        {
          path: "customer",
          populate: ["customer"],
        },
      ])
      .exec(function (err, orders) {
        Order.count().exec(function (err, count) {
          res.status(200).send({
            data: orders,
            pagination: {
              totalCount: count,
              currentPage: offset,
            },
          });
        });
      });

    // if (products) {
    //   return res.status(404).send("Products not found");
    // }

    // res.status(200).json(orders);
  } catch (err) {
    console.log(err);
  }
});

app.get("/order/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    const orderNumber = req.params.id;

    // const id = req.query.id
    const order = await Order.findOne({ orderNumber })
      .populate([
        {
          path: "orderItems",
          populate: { path: "product" },
        },
        {
          path: "customer",
          populate: ["customer"],
        },
      ])
      .exec();

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

app.post("/order/add", async (req, res) => {
  try {
    // Get user input
    const { customer, orderItems } = req.body;
    const id = crypto.randomBytes(5).toString("hex");
    let order = await Order.findOne({ orderNumber: id });

    if (order) {
      return res.status(404).send("Order Already Exist.");
    }

    const customerData = await Customer.create(customer);
    const orderItemData = await OrderItem.create(orderItems);
    // Create user in our database
    order = await Order.create({
      ...req.body,
      customer: customerData._id,
      orderNumber: id,
      orderItems: orderItemData.map((item) => item._id),
      // createdBy: req.user.user_id,
    });

    order = await Order.findOne({ _id: order._id })
      .populate([
        {
          path: "orderItems",
          populate: ["order_item"],
        },
        {
          path: "customer",
          populate: ["customer"],
        },
      ])
      .exec();

    sendEmail(
      {
        title: "Đặt hàng thành công",
        content: `"Đây là mã đơn hàng của bạn [ ${id} ]`,
      },
      customerData.email
    );

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

app.post("/order/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { orderNumber } = req.body;
    let order = await Order.findOneAndUpdate({ orderNumber }, req.body);
    order = await Order.findOne({ _id: order._id })
      .populate([
        {
          path: "orderItems",
          populate: ["order_item"],
        },
        {
          path: "customer",
          populate: ["customer"],
        },
      ])
      .exec();

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

app.get("/order/remove/:id", auth, async (req, res) => {
  try {
    const orderNumber = req.params.id;
    console.log("==== /order/remove/:id orderNumber", orderNumber);
    const order = await Order.findOneAndDelete({ orderNumber });

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

//=== Order Item ===
app.post("/orderItem/list", auth, async (req, res) => {
  try {
    // Get user input
    const { limit, page, orderNumber } = req.body;
    const order = await Order.findOne({ orderNumber });

    const orderItems = await OrderItem.find({ order: order._id })
      .limit(limit)
      .skip(limit * page)
      .sort({
        email: "asc",
      })
      .populate(["order", "product"])
      .exec();

    // if (products) {
    //   return res.status(404).send("Products not found");
    // }

    res.status(200).json(orderItems);
  } catch (err) {
    console.log(err);
  }
});

app.get("/orderItem/:id", auth, async (req, res) => {
  try {
    // Get user input
    // req.query.id === 'red'
    const id = req.params.id;

    // const id = req.query.id
    const orderItem = await OrderItem.findOne({ _id: id })
      .populate(["order", "product"])
      .exec();

    if (!orderItem) {
      return res.status(404).send("Order item not found");
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

app.post("/orderItem/add", auth, async (req, res) => {
  try {
    // Get user input
    const { quantity, total, order, product } = req.body;

    // // // Validate if user exist in our database
    // const oldItem = await Order.findOne({ sku });

    // if (oldItem) {
    //   return res.status(409).send("Product Already Exist.");
    // }

    // const id = crypto.randomBytes(5).toString("hex");
    // console.log('==== id', id)

    let orderItem = await OrderItem.findOne({ order, product });

    if (orderItem) {
      // return res.status(404).send("Order Already Exist.");
      orderItem = await OrderItem.findOneAndUpdate(
        { order, product },
        { quantity: orderItem.quantity + 1 }
      );
    } else {
      // Create user in our database
      orderItem = await OrderItem.create({
        ...req.body,
      });
    }

    orderItem = await OrderItem.findOne({ _id: orderItem._id })
      .populate(["order", "product"])
      .exec();

    res.status(201).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

app.post("/orderItem/update", auth, async (req, res) => {
  try {
    const { id } = req.body;
    let orderItem = await OrderItem.findOneAndUpdate({ _id: id }, req.body);
    if (orderItem) {
      orderItem = await OrderItem.findOne({ _id: orderItem._id })
        .populate(["order", "product"])
        .exec();
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

app.get("/orderItem/remove/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    let orderItem = await OrderItem.findOne({ _id: id });
    // console.log('==== orderItem', orderItem)
    if (orderItem) {
      switch (orderItem.quantity) {
        case 1:
          orderItem = await OrderItem.findOneAndDelete({ _id: id });
          break;
        default:
          orderItem = await OrderItem.findOneAndUpdate(
            { _id: id },
            { quantity: orderItem.quantity - 1 }
          );
          break;
      }
      orderItem = await OrderItem.findOne({ _id: id })
        .populate(["order", "product"])
        .exec();
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

//=== Brand ===
app.post("/brand/list", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const brands = await Brand.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, brands) {
        Brand.count().exec(function (err, count) {
          res.status(200).send({
            data: brands,
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
});

app.get("/brand/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    // console.log("==== req", req);

    const slug = req.params.id;
    const brand = await Brand.findOne({ slug });

    if (!brand) {
      return res.status(404).send("brand not found");
    }

    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
});

app.post("/brand/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { name, slug, description, logo } = req.body;

    // Validate if user exist in our database
    const oldBrand = await Brand.findOne({ slug });
    if (oldBrand) {
      return res.status(409).send("Brand Already Exist.");
    }

    // Create category in our database
    let brand = await Brand.create(req.body);

    brand = await Brand.findOne({ _id: brand._id });

    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
});

app.post("/brand/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const brand = await Brand.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
});

app.get("/brand/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const { name, slug, description } = req.body;
    const brand = await Brand.findOneAndDelete({ _id });
    console.log("==== /brand/remove/:id category", brand);
    res.status(200).json(brand);
  } catch (err) {
    console.log(err);
  }
});

//=== Advertisement ===
app.post("/advertisement/list", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get advertisement input
    const {
      pagination: { limit, offset },
    } = req.body;

    const advertisements = await Advertisement.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, advertisements) {
        Advertisement.count().exec(function (err, count) {
          res.status(200).send({
            data: advertisements,
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
});

app.get("/advertisement/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    // console.log("==== req", req);

    const id = req.params.id;
    const advertisement = await Advertisement.findOne({ _id: id });

    if (!advertisement) {
      return res.status(404).send("advertisement not found");
    }

    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
});

app.post("/advertisement/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldAdvertisement = await Advertisement.findOne({ name });
    if (oldAdvertisement) {
      return res.status(409).send("Advertisement Already Exist.");
    }

    // Create category in our database
    let advertisement = await Advertisement.create(req.body);

    advertisement = await Advertisement.findOne({ _id: advertisement._id });

    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
});

app.post("/advertisement/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const advertisement = await Advertisement.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
});

app.get("/advertisement/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const { name, slug, description } = req.body;
    const advertisement = await Advertisement.findOneAndDelete({ _id });
    res.status(200).json(advertisement);
  } catch (err) {
    console.log(err);
  }
});

//=== Email Template ===
app.post("/email-template/list", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

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
});

app.get("/email-template/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    // console.log("==== req", req);

    const id = req.params.id;
    const emailTemplate = await EmailTemplate.findOne({ _id: id });

    if (!emailTemplate) {
      return res.status(404).send("email Template not found");
    }

    res.status(200).json(emailTemplate);
  } catch (err) {
    console.log(err);
  }
});

app.post("/email-template/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

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
});

app.post("/email-template/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

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
});

app.get("/email-template/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const { name, slug, description } = req.body;
    const emailTemplate = await EmailTemplate.findOneAndDelete({ _id });
    res.status(200).json(emailTemplate);
  } catch (err) {
    console.log(err);
  }
});

//=== Popup Menu ===
app.post("/popup-menu/list", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const menu = await PopupMenu.find()
      .limit(limit)
      .skip(offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, menu) {
        PopupMenu.count().exec(function (err, count) {
          res.status(200).send({
            data: menu,
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
});

app.get("/popup-menu/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    // console.log("==== req", req);

    const id = req.params.id;
    const menu = await PopupMenu.findOne({ _id: id });

    if (!menu) {
      return res.status(404).send("menu not found");
    }

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
});

app.post("/popup-menu/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldMenu = await PopupMenu.findOne({ name });
    if (oldMenu) {
      return res.status(409).send("Menu Already Exist.");
    }

    // Create category in our database
    let menu = await PopupMenu.create(req.body);

    menu = await PopupMenu.findOne({ _id: menu._id });

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
});

app.post("/popup-menu/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const menu = await PopupMenu.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
});

app.get("/popup-menu/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const menu = await PopupMenu.findOneAndDelete({ _id });
    res.status(200).json(menu);
  } catch (err) {
    console.log(err);
  }
});

//=== Tag-seo ===
app.post("/tag-seo/list", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const tagSeo = await TagSeo.find()
      // .limit(limit)
      // .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, tagSeo) {
        Brand.count().exec(function (err, count) {
          res.status(200).send({
            data: tagSeo,
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
});

app.get("/tag-seo/:id", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    // req.query.id === 'red'
    // console.log("==== req", req);

    const slug = req.params.id;
    const tagSeo = await TagSeo.findOne({ slug });

    if (!tagSeo) {
      return res.status(404).send("tagSeo not found");
    }

    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
});

app.post("/tag-seo/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { name } = req.body;

    // Validate if user exist in our database
    const oldTagSeo = await TagSeo.findOne({ name });
    if (oldTagSeo) {
      return res.status(409).send("Tag Seo Already Exist.");
    }

    // Create category in our database
    let tagSeo = await TagSeo.create(req.body);

    tagSeo = await TagSeo.findOne({ _id: tagSeo._id });

    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
});

app.post("/tag-seo/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const tagSeo = await TagSeo.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
});

app.get("/tag-seo/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const tagSeo = await TagSeo.findOneAndDelete({ _id });
    res.status(200).json(tagSeo);
  } catch (err) {
    console.log(err);
  }
});

//=== Support ===
app.post("/support/list", async (req, res) => {
  try {
    // Get brand input
    const {
      pagination: { limit, offset },
    } = req.body;

    const support = await Support.find()
      .limit(limit)
      .skip(limit * offset)
      .sort({
        name: "asc",
      })
      .exec(function (err, support) {
        Support.count().exec(function (err, count) {
          res.status(200).send({
            data: support,
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
});

app.get("/support/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const support = await Support.findOne({ _id: id });

    if (!support) {
      return res.status(404).send("Support not found");
    }

    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
});

app.post("/support/add", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    // Get user input
    const { name, phone, title } = req.body;

    // Validate if user exist in our database
    const oldSupport = await Support.findOne({ name, phone, title });
    if (oldSupport) {
      return res.status(409).send("support Already Exist.");
    }

    // Create category in our database
    let support = await Support.create(req.body);

    support = await Support.findOne({ _id: support._id });

    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
});

app.post("/support/update", auth, async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:3000");

  try {
    const { _id } = req.body;
    // console.log('==== /category/update')
    const support = await Support.findOneAndUpdate(
      { _id },
      {
        ...req.body,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
});

app.get("/support/remove/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const support = await Support.findOneAndDelete({ _id });
    res.status(200).json(support);
  } catch (err) {
    console.log(err);
  }
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
