const express = require("express");
const Router = express.Router();
const { authenticated } = require("../controller/user");
const {
  getDataBiddings,
  getItemsBiddings,
  registerProposalComprasnet,
  getDataBiddingsPncp,
} = require("../controller/comprasnetScraping");

Router.post("/biddings", authenticated, getDataBiddings);
Router.get("/items_biddings", authenticated, getItemsBiddings);
Router.post("/register-proposal", authenticated, registerProposalComprasnet);
Router.post("/biddings-pncp", getDataBiddingsPncp);
module.exports = Router;
