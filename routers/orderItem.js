const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const orderItemList = require("../controllers/orderItem/orderItemList.controller");
const orderItemDetail = require("../controllers/orderItem/orderItemDetail.controller");
const orderItemAdd = require("../controllers/orderItem/orderItemAdd.controller");
const orderItemUpdate = require("../controllers/orderItem/orderItemUpdate.controller");
const orderItemRemove = require("../controllers/orderItem/orderItemRemove.controller");

app.post("/orderItem/list", auth, orderItemList);
app.get("/orderItem/:id", auth, orderItemDetail);
app.post("/orderItem/add", auth, orderItemAdd);
app.post("/orderItem/update", auth, orderItemUpdate);
app.get("/orderItem/remove/:id", auth, orderItemRemove);

module.exports = app
