const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const brandList = require("../controllers/brand/brandList.controller");
const brandDetail = require("../controllers/brand/brandDetail.controller");
const brandAdd = require("../controllers/brand/brandAdd.controller");
const brandUpdate = require("../controllers/brand/brandUpdate.controller");
const brandRemove = require("../controllers/brand/brandRemove.controller");

app.post("/brand/list", brandList);
app.get("/brand/:id", auth, brandDetail);
app.post("/brand/add", auth, brandAdd);
app.post("/brand/update", auth, brandUpdate);
app.get("/brand/remove/:id", auth, brandRemove);

module.exports = app

