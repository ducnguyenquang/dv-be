const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");
const emailTemplateList = require("../controllers/emailTemplate/emailTemplateList.controller");
const emailTemplateDetail = require("../controllers/emailTemplate/emailTemplateDetail.controller");
const emailTemplateAdd = require("../controllers/emailTemplate/emailTemplateAdd.controller");
const emailTemplateUpdate = require("../controllers/emailTemplate/emailTemplateUpdate.controller");
const emailTemplateRemove = require("../controllers/emailTemplate/emailTemplateRemove.controller");

app.post("/email-template/list", auth, emailTemplateList);
app.get("/email-template/:id", auth, emailTemplateDetail);
app.post("/email-template/add", auth, emailTemplateAdd);
app.post("/email-template/update", auth, emailTemplateUpdate);
app.get("/email-template/remove/:id", auth, emailTemplateRemove);

module.exports = app
