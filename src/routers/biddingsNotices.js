const express = require("express");
const Router = express.Router();
const { authenticated } = require("../controller/user");
const {
  getBiddingsNotices,
  getDataBiddingsNoticesPncp,
} = require("../controller/biddingsNotices");
Router.post("/", authenticated, getBiddingsNotices);
Router.post("/pncp", authenticated, getDataBiddingsNoticesPncp);
module.exports = Router;
