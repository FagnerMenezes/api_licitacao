const { default: axios } = require("axios");
require("../../types/typesComprasGov");
const {
  getTokenComprasGov,
} = require("../../services/comprasnet/getTokenComprasgov");
//https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/compras/16043405900092024/participacao

//const tk = 'Bearer eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiIwNDA1Mjk4MTUzNyIsInRpcG8iOiJGIiwiaWRlbnRpZmljYWNhb19mb3JuZWNlZG9yIjoiMTUxMzUyOTIwMDAxNDciLCJpZF9zZXNzYW8iOjUzMjgyNzg3LCJvcmlnZW1fc2Vzc2FvIjoiVyIsImF1dGVudGljYWNhbyI6IkwiLCJuaXZlaXNfY29uZmlhYmlsaWRhZGUiOlsxLDIsM10sInRpcG9fZm9ybmVjZWRvciI6IkoiLCJwb3J0ZV9mb3JuZWNlZG9yIjoiMSIsImlhdCI6MTcxOTQ0MTI5NSwiZXhwIjoxNzE5NDQxODk1fQ.iaTsuqpzeqB3FAdqyfX1C-HzPzwRWjv3ioldC7gs4LaRRGGJWlqJJrm4NQYPuuW2-NJiVGHGnDDZN1NvQtG_5o8e48EJ_cRyX2f7p4LEWMrxRHWbViw8YMOBdra-7THhQqISq5CEGz5vgBKzOiBXRUAmECQsPhXnX515mhQLBmi3OLefyyE6QRngEUNPocRyFtIFj2uMfgD-Vr7bF7gmIq0h5VmasV24xWVLrKFTFPdSHxhRrHUqgW2XhWcsa-t9tPvB7k1Q08tatSRz3ubeboasJ-58M3ZZDgj40DC5ywbHibVeGEEzewR-VRPz51qhLcwiBzs-18Q9RyPfmGzyW1fQ_dVOkfPh4yfg73nhZYITEYcihibEqEYAmbdDZEDKytw2NVSa-DFeNU1A1ysnDovRtISrx0wHM0AZEa1NPf_LTOdgqXcfUmdCJBpe4-gYnH2PFJiXGviggufW97RpyP6i0ymGAhu5dcSIgIgnbdcw1gfelPFv56fl-5EAf22IjmmqzEYe_ciFn1S8wWjiMHS0Czn3KksQEZGRTVIHPDIywop8cbF_8xqunlld1JFamCNm3-UFM_JBXRY8fIvOl5InWoWWDdYqFwZw5CYe9aiZ9ap-ZjyH9viJH9QJFfuyqkZqPnk1sJ2pE1uxaeC0A0R9XLHJKX9ByOvFf5zwFO4';

/**
 *@description END DECLARATION
 * @param {Data} data
 * @returns
 */
async function sendDeclarationProposalComprasGovPost(codeLicitacao, token) {
  try {
    const body = {
      declaracaoMeEpp: true,
    };

    const url = `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/compras/${codeLicitacao}/participacao`;

    const response = await axios.post(url, body, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response.status);
    return response.status;
  } catch (error) {
    console.log(error.message);
    return 401;
  }
}

//POST
/**
 * @description POST
 * @param {string} codeLicitacao
 * @param {string} item
 * @param {DataItem} body
 * @param {string} token
 * @returns
 */
async function registerProposalComprasGovPost(
  codeLicitacao,
  item,
  body,
  token
) {
  try {
    const url = `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/compras/${codeLicitacao}/itens/${item}/participacao`;

    const response = axios.post(url, body, {
      headers: {
        Authorization: token,
      },
    });
    const result = await response;
    return { status: result.status, msg: result.statusText };
  } catch (error) {
    //console.log(error.message)
    return { status: error.response.status, msg: error.message };
  }
}

//PUT
/**
 *
 * @param {string} codeLicitacao
 * @param {string} item
 * @param {DataItem} body
 * @param {string} token
 * @returns
 */
async function registerProposalComprasGovPut(codeLicitacao, item, body, token) {
  try {
    const url = `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/compras/${codeLicitacao}/itens/${item}/participacao`;

    const response = await axios.put(url, body, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response.data);
    return response.status;
  } catch (error) {
    console.log(error.message);
  }
}

//DELETE
/**
 *
 * @param {string} codeLicitacao
 * @param {string} item
 * @param {DataItem} body
 * @param {string} token
 * @returns
 */
async function registerProposalComprasGovDelete(codeLicitacao, item, token) {
  try {
    const url = `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/compras/${codeLicitacao}/itens/${item}/participacao`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response.data);
    return response.status;
  } catch (error) {
    console.log(error.message);
  }
}

//FUNCTION MAIN
/**
 *
 * @param {DataArray} data
 * @returns
 */
async function registerProposal(data) {
  try {
    const { codeLicitacao, itensContainer, token } = data;
    const declaration = await sendDeclarationProposalComprasGovPost(
      codeLicitacao,
      token
    );
    console.log(declaration);
    const promisseItens = itensContainer?.itens.map((item) =>
      registerProposalComprasGovPost(
        codeLicitacao,
        item.item,
        item.dataItem,
        token
      )
    );

    const response = await Promise.all(promisseItens);
    //console.log(response)
    return response;
  } catch (error) {
    // console.log(error)
  }
}

module.exports = {
  registerProposal,
  sendDeclarationProposalComprasGovPost,
};
