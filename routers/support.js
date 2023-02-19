const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");

const supportList = require('../controllers/support/supportList.controller');
const supportDetail = require('../controllers/support/supportDetail.controller');
const supportAdd = require('../controllers/support/supportAdd.controller');
const supportUpdate = require('../controllers/support/supportUpdate.controller');
const supportRemove = require('../controllers/support/supportRemove.controller');

app.post("/support/list", supportList);
app.get("/support/:id", auth, supportDetail);
app.post("/support/add", auth, supportAdd);
app.post("/support/update", auth, supportUpdate);
app.get("/support/remove/:id", auth, supportRemove);

module.exports = app
