const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");

const topMenuList = require('../controllers/topMenu/topMenuList.controller');
const topMenuDetail = require('../controllers/topMenu/topMenuDetail.controller');
const topMenuAdd = require('../controllers/topMenu/topMenuAdd.controller');
const topMenuUpdate = require('../controllers/topMenu/topMenuUpdate.controller');
const topMenuRemove = require('../controllers/topMenu/topMenuRemove.controller');

app.post("/top-menu/list", topMenuList);
app.get("/top-menu/:id", auth, topMenuDetail);
app.post("/top-menu/add", auth, topMenuAdd);
app.post("/top-menu/update", auth, topMenuUpdate);
app.get("/top-menu/remove/:id", auth, topMenuRemove);

module.exports = app
