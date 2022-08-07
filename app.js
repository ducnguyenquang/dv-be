require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors= require("cors");
const User = require("./model/user");
const Category = require("./model/category");
const Product = require("./model/product");
const Order = require("./model/order");
const OrderItem = require("./model/order_item");

const domainsFromEnv = process.env.CORS_DOMAINS || ""
const whitelist = domainsFromEnv.split(",").map(item => item.trim())

const auth = require("./middleware/auth");

const app = express();
// app.use((_req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET, POST, DELETE, PUT, PATCH, OPTIONS',
//   )
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, api_key, Authorization, Referer',
//   )
//   next()
// })

const corsOptions = {
  origin: function (origin, callback) {
    console.log('==== origin', origin)
    console.log('==== whitelist', whitelist)

    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
// register all custom Middleware
// app.use(cors({ optionsSuccessStatus: 200 }))
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

app.use(express.json({ limit: "50mb" }));

app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password, role } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role,
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

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  console.log('==== /login')
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
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

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.get("/sendEmail", auth, (req, res) => {
  var nodemailer = require('nodemailer');
  const { SENDER, SENDER_P } = process.env;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER,
      pass: SENDER_P
    }
  });

  var mailOptions = {
    from: SENDER,
    to: 'mr.nguyenquangduc@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  send();

  async function send() {
    const result = await transporter.sendMail(mailOptions);

    console.log(JSON.stringify(result, null, 4));
  }

  res.status(200).send("Sent email ... ");
});

//=== Category ===
app.post("/category/list", async (req, res) => {
  try {
    // Get user input
    const { limit, page } = req.body;

    const categories = await Category.find()
      .limit(limit)
      .skip(limit * page)
      .sort({
          name: 'asc'
      });

    console.log('==== categories', categories)
    // if (!categories) {
    //   return res.status(404).send("Categories not found");
    // }

    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
  }
});

app.get("/category/:id", async (req, res) => {
  try {
    // Get user input
    // req.query.id === 'red'
    console.log('==== req', req)

    const slug = req.params.id
    const category = await Category.findOne({ slug })

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});

app.post("/category/add", async (req, res) => {
  try {
    // Get user input
    const { name, slug, description } = req.body;

    // Validate if user exist in our database
    const oldCategory = await Category.findOne({ slug });
    if (oldCategory) {
      return res.status(409).send("Category Already Exist.");
    }

    // Create category in our database
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch (err) {
    console.log(err);
  }
});

app.post("/category/update", async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const category = await Category.findOneAndUpdate({ slug }, req.body);
    
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});

app.get("/category/remove/:id", async (req, res) => {
  try {
    const slug = req.params.id
    // const { name, slug, description } = req.body;
    const category = await Category.findOneAndDelete({ slug });
    
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
  }
});
//=== Product ===
app.post("/product/list", async (req, res) => {
  try {
    // Get user input
    const { limit, page } = req.body;
    const products = await Product.find()
      .limit(limit)
      .skip(limit * page)
      .sort({
          name: 'asc'
      }).populate('groups').exec();

    // if (products) {
    //   return res.status(404).send("Products not found");
    // }

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    // Get user input
    // req.query.id === 'red'
    const sku = req.params.id;

    // const id = req.query.id
    const product = await Product.findOne({ sku }).populate('groups').exec();

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

app.post("/product/add", async (req, res) => {
  try {
    // Get user input
    const { 
      name, 
      slug, 
      description,
      sku,
      brand,
      images,
      groups,
    } = req.body;

    // // Validate if user exist in our database
    const oldProduct = await Product.findOne({ sku });

    if (oldProduct) {
      return res.status(409).send("Product Already Exist.");
    }


    // Create user in our database
    let product = await Product.create(req.body);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    product = await Product.findOne({ _id: product._id }).populate('groups').exec();

    res.status(201).json(product);
  } catch (err) {
    console.log(err);
  }
});

app.post("/product/update", async (req, res) => {
  try {
    const { sku } = req.body;
    let product = await Product.findOneAndUpdate({ sku }, req.body);
    product = await Product.findOne({ _id: product._id }).populate('groups').exec();
    
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

app.get("/product/remove/:id", async (req, res) => {
  try {
    const sku = req.params.id;
    const product = await Product.findOneAndDelete({ sku });
    
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});
//=== Order ===
app.post("/order/list", auth, async (req, res) => {
  try {
    // console.log('===== login req', req);
    // Get user input
    const { limit, page } = req.body;
    const orders = await Order.find({ createdBy: req.user.user_id })
      .limit(limit)
      .skip(limit * page)
      .sort({
          email: 'asc'
      }).populate(['createdBy', {
        path : 'orderItems',
        populate : ['product']
      }]).exec();

    // if (products) {
    //   return res.status(404).send("Products not found");
    // }

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
  }
});

app.get("/order/:id", async (req, res) => {
  try {
    // Get user input
    // req.query.id === 'red'
    const orderNumber = req.params.id;

    // const id = req.query.id
    const order = await Order.findOne({ orderNumber })
      .populate('orderItems').exec();

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

app.post("/order/add", auth, async (req, res) => {
  try {
    // Get user input
    const { 
      email,
      total,
      orderItems,
    } = req.body;

    // // // Validate if user exist in our database
    // const oldItem = await Order.findOne({ sku });

    // if (oldItem) {
    //   return res.status(409).send("Product Already Exist.");
    // }

    const id = crypto.randomBytes(5).toString("hex");
    // console.log('==== id', id)

    let order = await Order.findOne({ orderNumber: id });

    if (order) {
      return res.status(404).send("Order Already Exist.");
    }
    // Create user in our database
    order = await Order.create({
      ...req.body, 
      orderNumber: id,
      createdBy: req.user.user_id,
    });

    order = await Order.findOne({ _id: order._id }).populate('orderItems').exec();

    res.status(201).json(order);
  } catch (err) {
    console.log(err);
  }
});

app.post("/order/update", async (req, res) => {
  try {
    const { order_number } = req.body;
    let order = await Order.findOneAndUpdate({ order_number }, req.body);
    order = await Order.findOne({ _id: order._id }).populate('orderItems').exec();
    
    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

app.get("/order/remove/:id", async (req, res) => {
  try {
    const orderNumber = req.params.id;
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

    const orderItems = await OrderItem.find({ order: order._id})
      .limit(limit)
      .skip(limit * page)
      .sort({
          email: 'asc'
      }).populate(['order', 'product']).exec();

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
      .populate(['order', 'product']).exec();

    if (!orderItem) {
      return res.status(404).send("Order item not found");
    }

    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

app.post("/orderItem/add", async (req, res) => {
  try {
    // Get user input
    const { 
      quantity,
      total,
      order,
      product,
    } = req.body;

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
      orderItem = await OrderItem.findOneAndUpdate({ order, product }, { quantity: orderItem.quantity + 1 });
    } else {
      // Create user in our database
      orderItem = await OrderItem.create({
        ...req.body,
      });
    }
    
    orderItem = await OrderItem.findOne({ _id: orderItem._id }).populate(['order', 'product']).exec();

    res.status(201).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

app.post("/orderItem/update", async (req, res) => {
  try {
    const { id } = req.body;
    let orderItem = await OrderItem.findOneAndUpdate({ _id: id }, req.body);
    if (orderItem) {
      orderItem = await OrderItem.findOne({ _id: orderItem._id }).populate(['order', 'product']).exec();
    }
    
    res.status(200).json(orderItem);
  } catch (err) {
    console.log(err);
  }
});

app.get("/orderItem/remove/:id", async (req, res) => {
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
          orderItem = await OrderItem.findOneAndUpdate({ _id: id }, { quantity: orderItem.quantity - 1 });
          break;
      }
      orderItem = await OrderItem.findOne({ _id: id }).populate(['order', 'product']).exec();
    }
    
    res.status(200).json(orderItem);
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
