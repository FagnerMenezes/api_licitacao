const { default: axios } = require('axios');
const { v4: ID } = require('uuid');
const { converterData } = require("../../util/formatDate");

const keywords = [
  "solda",
  "eletrodo",
  "eletrodos",
  "inversora",
  "regulador",
  "soldagem",
  "mascara",
  "tungstênio",
  "furadeira",
  "compressor",
  "gerador",
  "cilindro",
  "Vareta",
  "escova",
];
/**
 * @typedef {Object} BidItem
 * @property {string} cnpj - O CNPJ do órgão.
 * @property {string} edital - O título do edital.
 * @property {string} orgao - O nome do órgão.
 * @property {string} numero_sequencial - O número sequencial.
 * @property {string} ano - ano da licitação.
 */

/**
 * @typedef {Object} Data
 * @property {Array} items - Os itens do array.
 * @property {string} total - O total de itens .
 */

/**
 * @description função principal para buscar os dados no portal PNCP
 * @param {any} pagina número da paginação
 * @param {any} pageLength total de dados a serem retornados de 10 - 1000
 * @param {any} dateInit data inicial
 * @param {any} dateFinish data final
 */

async function getBiddingsNoticesPNCP(
  pagina,
  // @ts-ignore
  // @ts-ignore
  pageLength,
  dateInit,
  // @ts-ignore
  dateFinish
) {
  try {
    const url = `https://pncp.gov.br/api/search/?q=SOLDA&tipos_documento=edital&ordenacao=-data&pagina=${pagina}&tam_pagina=1000&status=recebendo_proposta&modalidades=6|8`;
    const response = await axios
      .get(url)
      .then((result) => {

        const dataBidding = result.data.items.filter(
          (
            /** @type {{ data_publicacao_pncp: string;createdAt:string }} */ item
          ) =>
            item.createdAt.includes(converterData(dateInit).toString()) ||
            item.createdAt.includes(converterData(dateFinish).toString())
        );
        /** @type {Data} */
        const data = {
          items: dataBidding,
          total: dataBidding.length,
        };

        return data;
      })
      .catch((error) => {
        console.log(error.message, 'Funcao: getBiddingsNoticesPNCP');

      });
    /**
     * @type {number} total
     */
    const total = parseInt(response.total) ?? 0;

    /** @type {Array<BidItem>} */
    const biddings = response.items.map(
      (
        /** @type {{ orgao_cnpj: string; title: string; orgao_nome: string; numero_sequencial: string;ano:string; numero_controle_pncp:string }} */ item
      ) => {
        /**
         * @type {BidItem}
         */
        const bidding = {
          cnpj: item.orgao_cnpj,
          edital: String(item.title)
            .replace(/[^0-9]/gi, "")
            .trim(),
          orgao: item.orgao_nome,
          numero_sequencial: item.numero_sequencial,
          ano: item.ano,
          code_pncp: item.numero_controle_pncp,
        };
        return bidding;

      }
    );

    return { biddings, total };
  } catch (error) {
    console.log(error.message, "getBiddingsNoticesPNCP");

  }
}


/**
 * @description Função para buscar licitações no portal PNCP pelo code_pncp
 * @param {string} code_pncp código de controle do portal pncp
 * @returns array objeto json
 */
async function getBiddingsNoticesCodePNCP(code_pncp) {
  try {

    const url = `https://pncp.gov.br/api/search/?q=${code_pncp}&tipos_documento=edital&ordenacao=-data&pagina=1&tam_pagina=1&status=todos`;
    const response = await axios
      .get(url)
      .then((result) => {
        const dataBidding = result.data.items;
        /** @type {Data} */
        const data = {
          items: dataBidding,
          total: result.data.total,
        };
        return data;
      })
      .catch((error) => {
        console.log(error.message);

      });
    /**
     * @type {number} total
     */
    const total = parseInt(response.total) ?? 0;
    /** @type {Array<BidItem>} */
    const biddings = response?.items?.map(
      (
        /** @type {{ orgao_cnpj: string; title: string; orgao_nome: string; numero_sequencial: string;ano:string }} */ item
      ) => {
        /**
         * @type {BidItem}
         */
        const bidding = {
          cnpj: item.orgao_cnpj,
          edital: String(item.title)
            .replace(/[^0-9]/gi, "")
            .trim(),
          orgao: item.orgao_nome,
          numero_sequencial: item.numero_sequencial,
          ano: item.ano,
        };
        //console.log(bidding);
        return bidding;
      }
    );
    return { biddings, total };
  } catch (error) {
    console.log(error.message, "getBiddingsNoticesPNCP");
  }
}

/**
 * @param {any} uasg
 */
async function getBiddingsNoticesPNCPForUasg(uasg) {
  try {
    const url = `https://pncp.gov.br/api/search/?q=${uasg}&tipos_documento=edital&ordenacao=-data&pagina=1&tam_pagina=100&status=recebendo_proposta`;
    const response = await axios
      .get(url)
      .then((result) => {
        /** @type {Data} */

        const data = {
          items: result.data.items,
          total: result.data.total,
        };
        return data;
      })
      .catch((error) => {
        console.log(error.message, "getBiddingsNoticesPNCPForUasg");
        //return [];
      });
    /**
     * @type {number} total
     */
    const total = parseInt(response.total) ?? 0;
    //console.log(response.items)
    /** @type {Array<BidItem>} */
    const biddings = response?.items?.map(
      (
        /** @type {{ orgao_cnpj: string; title: string; orgao_nome: string; numero_sequencial: string;ano:string; numero_controle_pncp:string }} */ item
      ) => {
        /**
         * @type {BidItem}
         */
        const bidding = {
          cnpj: item.orgao_cnpj,
          edital: String(item.title)
            .replace(/[^0-9]/gi, "")
            .trim(),
          orgao: item.orgao_nome,
          numero_sequencial: item.numero_sequencial,
          ano: item.ano,
          code_pncp: item.numero_controle_pncp,
        };

        return bidding;
      }
    );
    return { biddings, total };
  } catch (error) {
    console.log(error.message, "getBiddingsNoticesPNCPForUasg");
    return []
  }
}

/**
 * @description RETORNA AS INFORMAÇÕES GERAIS DOS EDITAIS
 * @param {string} cnpj
 * @param {string} code
 * @returns Retorna um array
 * @param {string} year
 */
async function getDataBiddingsPNCP(cnpj, code, year) {
  try {
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/${year}/${code}`;
    const data = await axios
      .get(url)
      .then(async (element) => {
        const data = {
          process_data: {
            status: "Cadastrar proposta",
            type_dispute: "Menor preço unitário",
            modality:
              element.data.modalidadeId === 8
                ? "DL"
                : element.data.modalidadeId === 6
                  ? "PE"
                  : "PE",
            portal: await checkPortalPncp(element.data.usuarioNome),
            n_process: element.data?.processo,
            bidding_notice:
              element.data?.numeroCompra + "" + element.data?.anoCompra,
            date_finish: String(element.data?.dataEncerramentoProposta).slice(
              0,
              10
            ),
            date_init: String(element.data?.dataAberturaProposta).slice(0, 10),
            hours_finish: String(element.data?.dataEncerramentoProposta).slice(
              11,
              16
            ),
            object: element.data.objetoCompra,
            code_pncp: element.data.numeroControlePNCP,
          },
          government: [
            {
              _id: ID(),
              name: element.data?.orgaoEntidade?.razaoSocial,
              cnpj: element.data?.orgaoEntidade?.cnpj,
              code_government: element.data?.unidadeOrgao?.codigoUnidade,
              manager: "true",
              address: [
                {
                  id: ID(),
                  type_address: "LICITACAO",
                  street: "",
                  number: "",
                  district: "",
                  zip_code: "",
                  uf: element.data?.unidadeOrgao?.ufSigla,
                  city: element.data?.unidadeOrgao?.municipioNome,
                  complement: "",
                },
              ],
              contact: [
                {
                  id: ID(),
                  tipo: "TEL",
                  name: "",
                  sector: "",
                  contact: "",
                },
              ],
            },
          ],
        };

        return data;
      })
      .catch((error) => {
        return error.message;
      });
    return data;
  } catch (error) {
    console.log(error.message, "getDataBiddingsPNCP");
    return error;
  }
}

/**
 * @descriptions Obtém os itens referente a licitação
 * @param {string} cnpj cnpj do órgão
 * @param {string} code código da licitação
 * @param {string} amoutItems total de itens
 * * @param {string} year ano da licitação
 * @returns Retorna um array com os itens
 */
async function getBiddingsItemsPNCP(cnpj, code, amoutItems, year) {
  try {
    const ds = {
      cnpj,
      code,
      amoutItems,
      year,
    };
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${ds.cnpj}/compras/${ds.year}/${ds.code}/itens?pagina=1&tamanhoPagina=${ds.amoutItems}`;
    const Items = await axios
      .get(url)
      .then((result) => {
        const items = result.data.map(
          (
            /** @type {{ numeroItem: string; quantidade: string; unidadeMedida: string; descricao: string; valorUnitarioEstimado: string; }} */ item
          ) => {
            return {
              _id: ID(),
              cod: item.numeroItem,
              lote: "",
              amount: item.quantidade,
              unit: item.unidadeMedida,
              description: item.descricao,
              brand: "",
              model: "",
              unitary_value: { $numberDecimal: "0" },
              value_reference: {
                $numberDecimal: item.valorUnitarioEstimado.toString(),
              },
              winner: "false",
              item_balance: 0,
            };
          }
        );
        //console.log(items)
        return items;
      })
      .catch((error) => {
        return [];
      });

    return Items;
  } catch (error) {
    console.log(error.message, "getBiddingsItemsPNCP");
  }
}

/**
 *
 * @param {string} cnpj
 * @param {string} code
 * @param {string} year
 * @returns
 */
async function getEditalPncp(cnpj, code, year) {
  try {
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/${year}/${code}/arquivos?pagina=1&tamanhoPagina=10`;
    const response = await axios.get(url);
    const files = response.data.map(
      (/** @type {{ uri: any; }} */ file) => file.uri
    );
    // console.log(response.data[0]);
    return files.length > 0 ? response.data[0].uri : null;
  } catch (error) {
    console.error(error.message, "getEditalPncp");
    return "";
  }
}

/**
 *
 * @param {string} portal
 * @returns String com Descrição do portal de compras
 */
const checkPortalPncp = async (portal) => {
  const portalMappings = {
    "Compras.gov.br": "COMPRASNET",
    "ECustomize Consultoria em Software S.A": "COMPRAS PUBLICAS",
    "Licitanet Licitações Eletrônicas Eireli": "LICITANET",
    "PROCERGS - CENTRO DE TECNOLOGIA DA INFORMACAO E COMUNICACAO DO ESTADO DO RIO GRANDE DO SUL S.A.":
      "COMPRAS RS",
    "Novo BBMNET Licitações": "BBMNET",
    "Bolsa Nacional De Compras - BNC": "BNC",
    "Governançabrasil Tecnologia e Gestão em Serviços": "Licitacoes-e",
  };

  const upperCasePortalMappings = Object.keys(portalMappings).reduce(
    (acc, key) => {
      acc[key?.toUpperCase()] = portalMappings[key];
      return acc;
    },
    {}
  );

  return upperCasePortalMappings[portal?.toUpperCase()] || portal;
};

/**
 * @description Função geral para organizar os dados da licitação vindo do portal pncp
 * @param {string} code codigo PNCP
 * @returns array objeto json
 */
const getDataBiddingPortalPncp = async (code) => {
  try {

    const data = await getBiddingsNoticesCodePNCP(code);
    //console.log(data.biddings)
    if (data.total > 0) {
      const promises = data.biddings.map(async (bidding) => {
        const biddingInfoPromise = getDataBiddingsPNCP(
          bidding.cnpj,
          bidding.numero_sequencial,
          bidding.ano
        );

        const biddingItemsPromise = getBiddingsItemsPNCP(
          bidding.cnpj,
          bidding.numero_sequencial,
          "1000",
          bidding.ano
        );

        const biddingAttachmentPromise = getEditalPncp(
          bidding.cnpj,
          bidding.numero_sequencial,
          bidding.ano
        );

        const [biddingInfo, biddingItems, biddingAttachment] =
          await Promise.all([
            biddingInfoPromise,
            biddingItemsPromise,
            biddingAttachmentPromise,
          ]);
        return {
          biddingInfo,
          biddingItems,
          biddingAttachment,
        };
        // }
      });
      const dataAllBidding = await Promise.all(promises);
      const dataSet = dataAllBidding.map((response) => {
        const filteredItems = response.biddingItems.filter((item) => {
          const verifyItem = verificarPalavrasChave(item.description, keywords);
          return verifyItem;
        });
        if (filteredItems.length > 0) {
          const Items = response.biddingItems.filter((item) => {
            const verifyItem = verificarPalavrasChave(
              item.description,
              keywords
            );
            return verifyItem;
          });

          return {
            _id: ID(),
            process_data: response?.biddingInfo.process_data,
            government: response.biddingInfo.government,
            reference_term: {
              validity: "",
              guaranteed: "",
              deadline: "",
              itens: Items,
            },
            edital: response?.biddingAttachment,
          };
        }
      });
      return dataSet;
    }
  } catch (error) {
    console.log(error.message, "getDataBiddingPortalPncp");
    //return {};
  }
};

// Função para verificar se o texto contém palavras-chave
function verificarPalavrasChave(texto, palavrasChave) {
  // Converte o texto para minúsculas para tornar a comparação insensível a maiúsculas e minúsculas
  const textoMinusc = texto.toLowerCase();

  // Verifica se o texto contém cada palavra-chave
  for (let i = 0; i < palavrasChave.length; i++) {
    const palavraChave = palavrasChave[i].toLowerCase();
    //console.log(textoMinusc, palavraChave);
    if (textoMinusc.includes(palavraChave)) {
      return true; // Se encontrar qualquer palavra-chave, retorna verdadeiro
    }
  }

  return false; // Se nenhuma palavra-chave for encontrada, retorna falso
}


const getDataPCNP = async (
  /** @type {string} */ pagina,
  /** @type {string} */ pageLength,
  /** @type {any} */ dateInit,
  /** @type {any} */ dateFinish
) => {
  try {
    const data = await getBiddingsNoticesPNCP(
      pagina,
      pageLength,
      dateInit,
      dateFinish
    );
    // @ts-ignore
    const ds = [];
    console.log(data.biddings.length)
    //if (data.total > 0) {
    // @ts-ignore
    for (let i = 0; i < data?.biddings?.length; i++) {
      // @ts-ignore
      ds.push(await getDataBiddingPortalPncp(data.biddings[i].code_pncp));
    }
    //@ts-ignore
    const dataSet = ds.flatMap((x) => x);
    return dataSet;
    //  }
  } catch (error) {
    console.log(error.message, "getDataPCNP");
  }
};

module.exports = { getDataBiddingPortalPncp, getDataPCNP, getBiddingsNoticesPNCPForUasg };