const express = require("express");
const Router = express.Router();
const { authenticated } = require("../controller/user");
const {
  getDataBiddings,
  getItemsBiddings,
  registerProposalComprasnet,
} = require("../controller/comprasnetScraping");

Router.post("/biddings", authenticated, getDataBiddings);
Router.get("/items_biddings", authenticated, getItemsBiddings);
Router.route("/register-proposal").post((req, res) =>
  registerProposalComprasnet(req, res)
);

module.exports = Router;
