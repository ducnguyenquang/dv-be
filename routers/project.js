const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");

const projectList = require('../controllers/project/projectList.controller');
const projectDetail = require('../controllers/project/projectDetail.controller');
const projectAdd = require('../controllers/project/projectAdd.controller');
const projectUpdate = require('../controllers/project/projectUpdate.controller');
const projectRemove = require('../controllers/project/projectRemove.controller');

app.post("/project/list", projectList);
app.get("/project/:id", auth, projectDetail);
app.post("/project/add", auth, projectAdd);
app.post("/project/update", auth, projectUpdate);
app.get("/project/remove/:id", auth, projectRemove);

module.exports = app
