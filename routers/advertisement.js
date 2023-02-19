const { Router } = require("express");
const app = Router();
const auth = require("../middleware/auth");
const advertisementList = require("../controllers/advertisement/advertisementList.controller");
const advertisementDetail = require("../controllers/advertisement/advertisementDetail.controller");
const advertisementAdd = require("../controllers/advertisement/advertisementAdd.controller");
const advertisementUpdate = require("../controllers/advertisement/advertisementUpdate.controller");
const advertisementRemove = require("../controllers/advertisement/advertisementRemove.controller");

app.post("/advertisement/list", advertisementList);
app.get("/advertisement/:id", auth, advertisementDetail);
app.post("/advertisement/add", auth, advertisementAdd);
app.post("/advertisement/update", auth, advertisementUpdate);
app.get("/advertisement/remove/:id", auth, advertisementRemove);

module.exports = app;
