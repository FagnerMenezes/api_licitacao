require("dotenv").config();
const axios = require("axios").default;
const registerProposalComprasnetEffecti = async (/** @type {any} */ body) => {
  const url =
    "https://mdw.minha.effecti.com.br/api-integracao/v1/proposta/comprasnet";
  const authorization = "Bearer " + process.env.TOKEN_EFFECTI;
  const headersList = {
    Accept: "*/*",
    Authorization: authorization,
    "Content-Type": "application/json",
  };

  const bodyContent = body;
  const reqOptions = {
    url: url,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  const response = await axios
    .request(reqOptions)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response;
    });
  return response;
};
module.exports = {
  registerProposalComprasnetEffecti,
};
