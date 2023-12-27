const express = require("express");
const Router = express.Router();
const bec = require("../controller/becScraper");
const { getDataBiddingPortalBec } = require("../controller/getDataBiddingBec");
//const scrap = require('../controller/becAwsScraping');
const UserController = require("../controller/user");

Router.route("/chat/:oc").get((req, res) => bec.getChat(req, res));
Router.route("/register-proposal").post((req, res) =>
  bec.registerProposalBec(req, res)
);
Router.route("/dados/:oc").get((req, res) => bec.getDataGovernment(req, res));
Router.route("/description-item/:codeItem").get((req, res) =>
  bec.getDescriptionItemBec(req, res)
);
Router.get("/biddings", getDataBiddingPortalBec);

//Router.route("/create").post((req, res) => UserController.create(req, res));

module.exports = Router;
