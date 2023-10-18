const express = require("express");
const Router = express.Router();
const {
  getDataBiddings,
  getItemsBiddings,
} = require("../controller/comprasnetScraping");

Router.get("/biddings", getDataBiddings);
Router.get("/items_biddings", getItemsBiddings);
//Router.route("/login").get((req, res) => comprasnet.loginComprasnet(req, res));
// Router.route('/links/:oc').get( (req,res) => bec.getLinks(req, res) )
// Router.route('/dados/:oc').get( (req,res) => bec.getDataGoverment(req, res) )

module.exports = Router;
