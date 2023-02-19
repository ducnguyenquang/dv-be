const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");

const userList = require('../controllers/user/userList.controller');
const userDetail = require('../controllers/user/userDetail.controller');
const userAdd = require('../controllers/user/userAdd.controller');
const userUpdate = require('../controllers/user/userUpdate.controller');
const userRemove = require('../controllers/user/userRemove.controller');

app.post("/user/list", auth, userList);
app.get("/user/:id", auth, userDetail);
app.post("/user/add", auth, userAdd);
app.post("/user/update", auth, userUpdate);
app.get("/user/remove/:id", auth, userRemove);

module.exports = app;