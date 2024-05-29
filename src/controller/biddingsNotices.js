const { StatusCodes } = require("http-status-codes");
const {
  getDataBiddingPortalPncp,
} = require("../services/pncp/getBiddingsPncp");
const {
  getDataBidding,
} = require("../services/comprasnet/getDataBiddingsComprasnet");

/**
 * @description Retorna os dados da licitações retiradas dos portais
 * @param {{ body: any; }} req
 * @param {*} res
 */
const getBiddingsNotices = async (req, res) => {
  try {
    // @ts-ignore
    const { data, total, total_pages } = await getDataBidding(req.body);
    //console.log(data)
    res.status(StatusCodes.OK).json({ data, total, total_pages });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: error.message });
  }
};
/**
 *@description Retorna os dados da licitações cadastradas no portal PNCP
 * @param {{ body: any; }} req
 * @param {*} res
 */
const getDataBiddingsNoticesPncp = async (req, res) => {
  try {
    const data = await getDataBiddingPortalPncp(req.body.codePncp);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Erro ao solicitar os dados" });
  }
};

module.exports = {
  getBiddingsNotices,
  getDataBiddingsNoticesPncp,
};
