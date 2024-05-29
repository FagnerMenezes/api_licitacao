const express = require("express");
const Router = express.Router();
const { authenticated } = require("../controller/user");
const {
  registerProposalEffectiComprasnet,
} = require("../controller/registerProposal");
Router.post("/comprasnet", authenticated, registerProposalEffectiComprasnet);

module.exports = Router;
