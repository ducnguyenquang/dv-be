const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const orderList = require("../controllers/order/orderList.controller");
const orderDetail = require("../controllers/order/orderDetail.controller");
const orderAdd = require("../controllers/order/orderAdd.controller");
const orderUpdate = require("../controllers/order/orderUpdate.controller");
const orderRemove = require("../controllers/order/orderRemove.controller");

app.post("/order/list", auth, orderList);
app.get("/order/:id", auth, orderDetail);
app.post("/order/add", orderAdd);
app.post("/order/update", auth, orderUpdate);
app.get("/order/remove/:id", auth, orderUpdate);

module.exports = app
