const express = require("express");
const Router = express.Router();
const { authenticated } = require("../controller/user");


const { ComprasGov } = require('../controller/getDataComprasgov')

Router.post('/chat', authenticated, ComprasGov.Chat);

module.exports = Router;