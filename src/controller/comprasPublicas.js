const {
  dataSetPortalComprasPublicas,
} = require("../models/portalComprasPublicas/getBiddings");

exports.executeScrapingInPortalComprasPublicas = async (req, res) => {
  try {
    const response = await dataSetPortalComprasPublicas(req.body, 0);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send({ error: error });
  }
};
