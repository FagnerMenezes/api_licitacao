const {
  dataSetPortalComprasPublicas,
} = require("../models/portalComprasPublicas/getBiddings");

exports.executeScrapingInPortalComprasPublicas = async (body) => {
  try {
    const response = await dataSetPortalComprasPublicas(body, 0);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
