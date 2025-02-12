
const { getChat } = require('../services/comprasnet/getDataComprasgov');

const ComprasGov = {

    /**
    * @description PEGAR CHAT PORTAL COMPRASGOV
    * @param {import('express').Request} req - Objeto de requisição do Express.
    * @param {import('express').Response} res - Objeto de requisição do Express.
    */
    Chat: async (req, res) => {
        try {
            //console.log(req.body)
            const response = await getChat(req.body)
            //console.log(response)
            res.status(response.status).json(
                {
                    data: response.data,
                    msg: response.msg,
                    status: response.status
                });
        } catch (error) {
            console.log(error.message)
        }
    },

}

module.exports = { ComprasGov }