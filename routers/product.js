const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");

const productList = require('../controllers/product/productList.controller');
const productDetail = require('../controllers/product/productDetail.controller');
const productAdd = require('../controllers/product/productAdd.controller');
const productUpdate = require('../controllers/product/productUpdate.controller');
const productRemove = require('../controllers/product/productRemove.controller');

app.post('/product/list', productList);
app.get("/product/:id", productDetail);
app.post("/product/add", auth, productAdd);
app.post("/product/update", auth, productUpdate);
app.get("/product/remove/:id", auth, productRemove);

module.exports = app