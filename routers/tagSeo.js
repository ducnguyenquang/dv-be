const { Router } = require('express');
const app = Router();
const auth = require("../middleware/auth");

const tagSeoList = require('../controllers/tagSeo/tagSeoList.controller');
const tagSeoDetail = require('../controllers/tagSeo/tagSeoDetail.controller');
const tagSeoAdd = require('../controllers/tagSeo/tagSeoAdd.controller');
const tagSeoUpdate = require('../controllers/tagSeo/tagSeoUpdate.controller');
const tagSeoRemove = require('../controllers/tagSeo/tagSeoRemove.controller');

app.post("/tag-seo/list", tagSeoList);
app.get("/tag-seo/:id", auth, tagSeoDetail);
app.post("/tag-seo/add", auth, tagSeoAdd);
app.post("/tag-seo/update", auth, tagSeoUpdate);
app.get("/tag-seo/remove/:id", auth, tagSeoRemove);

module.exports = app

