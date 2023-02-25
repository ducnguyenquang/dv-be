const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const commonList = require("../controllers/common/commonList.controller");
const commonDetail = require("../controllers/common/commonDetail.controller");
const commonAdd = require("../controllers/common/commonAdd.controller");
const commonUpdate = require("../controllers/common/commonUpdate.controller");
const commonRemove = require("../controllers/common/commonRemove.controller");

app.post("/common/list", commonList);
app.get("/common/:id", commonDetail);
app.post("/common/add", auth, commonAdd);
app.post("/common/update", auth, commonUpdate);
app.get("/common/remove/:id", auth, commonRemove);

module.exports = app;