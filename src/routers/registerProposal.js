const express = require("express");
const Router = express.Router();
const { authenticated } = require("../controller/user");
const {
  registerProposalEffectiComprasnet,
  registerProposalComprasGovPost,
  sendDeclarationComprasGov
} = require("../controller/registerProposal");

Router.post("/comprasnet", authenticated, registerProposalEffectiComprasnet);
Router.post("/comprasgov", registerProposalComprasGovPost);
Router.post("/declaration_proposal_comprasgov", sendDeclarationComprasGov);

module.exports = Router;
