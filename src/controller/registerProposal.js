const {
  registerProposalComprasnetEffecti,
} = require("../services/comprasnet/registerProposalEffecti");

/**
 * @description Cadastrar a proposta do portal comprasnet no sistema effecti
 * @param {{body: any;}} req
 */
async function registerProposalEffectiComprasnet(req, res) {
  try {
    const response = await registerProposalComprasnetEffecti(req.body);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

module.exports = {
  registerProposalEffectiComprasnet,
};
