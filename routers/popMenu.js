const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const popupMenuList = require("../controllers/popupMenu/popupMenuList.controller");
const popupMenuDetail = require("../controllers/popupMenu/popupMenuDetail.controller");
const popupMenuAdd = require("../controllers/popupMenu/popupMenuAdd.controller");
const popupMenuUpdate = require("../controllers/popupMenu/popupMenuUpdate.controller");
const popupMenuRemove = require("../controllers/popupMenu/popupMenuRemove.controller");

app.post("/popup-menu/list", popupMenuList);
app.get("/popup-menu/:id", auth, popupMenuDetail);
app.post("/popup-menu/add", auth, popupMenuAdd);
app.post("/popup-menu/update", auth, popupMenuUpdate);
app.get("/popup-menu/remove/:id", auth, popupMenuRemove);

module.exports = app
