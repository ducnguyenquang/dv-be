const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const categoryList = require("../controllers/category/categoryList.controller");
const categoryDetail = require("../controllers/category/categoryDetail.controller");
const categoryAdd = require("../controllers/category/categoryAdd.controller");
const categoryUpdate = require("../controllers/category/categoryUpdate.controller");
const categoryRemove = require("../controllers/category/categoryRemove.controller");

app.post("/category/list", categoryList);
app.get("/category/:id", categoryDetail);
app.post("/category/add", auth, categoryAdd);
app.post("/category/update", auth, categoryUpdate);
app.get("/category/remove/:id", auth, categoryRemove);

module.exports = app;