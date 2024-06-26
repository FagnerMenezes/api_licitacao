const {
  registerProposalComprasnetEffecti,
} = require("../services/comprasnet/registerProposalEffecti");

const { registerProposal, sendDeclarationProposalComprasGovPost } = require("../services/comprasnet/proposalComprasGov");
const { StatusCodes } = require('http-status-codes');


/**
 * @description Cadastrar a proposta do portal comprasgov
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {import('express').Response} res - Objeto de requisição do Express.
 */
async function registerProposalEffectiComprasnet(req, res) {

  try {
    const response = await registerProposalComprasnetEffecti(req.body);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}


/**
 * @description ENVIAR DECLRAÇÃO PORTAL COMPRASGOV
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {import('express').Response} res - Objeto de requisição do Express.
 */
async function sendDeclarationComprasGov(req, res) {
  try {
    const data = req.body
    const response = await sendDeclarationProposalComprasGovPost(data);

    if (response === 401) {
      res.status(response).json({ msg: 'Não autorizado', status: 401 });
    } else {
      res.status(response).json({ msg: 'Declaração cadastrada com sucesso', status: response });
    }

  } catch (error) {
    console.log(error)
  }

}

/**
 * @description CADASTRAR PROPOSTA PORTAL COMPRASGOV
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {import('express').Response} res - Objeto de requisição do Express.
 */
async function registerProposalComprasGovPost(req, res) {
  try {
    const data = req.body
    const response = await registerProposal(data)
    console.log(response)
    res.status(response[0].status).json(response);
  } catch (error) {
    //console.log(error.message)
  }

}

module.exports = {
  registerProposalEffectiComprasnet,
  sendDeclarationComprasGov,
  registerProposalComprasGovPost
};
