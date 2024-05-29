const axios = require("axios").default;
const chr = require("cheerio");
const { getDataBiddingPortalPncp } = require("../pncp/getBiddingsPncp");
const {
  dataSetPortalComprasPublicas,
} = require("../../services/comprasPublicas/getBiddingsNotices");
const { converterData } = require("../../util/formatDate");

/**
 * @typedef {Object} BidItem
 * @property {string} cnpj - O CNPJ do órgão.
 * @property {string} edital - O título do edital.
 * @property {string} orgao - O nome do órgão.
 * @property {string} numero_sequencial - O número sequencial.
 * @property {string} ano - ano da licitação.
 * @property {string} code_pncp - ano da licitação.
 */

/**
 * @typedef {Object} Data
 * @property {Array} items - Os itens do array.
 * @property {string} total - O total de itens .
 */

/**
 * @description Função para buscar licitações no portal PNCP
 * @param {string} pagina numero da paginação
 * @param {string} pageLength total de paginas
 * @param {string} dateInit data inicial ex. 00/00/0000
 * @param {string} dateFinish data final ex. 00/00/0000
 * @returns array objeto json
 */

/**
 * @description Obtém todos os dados da licitação
 * @param {string} pagina numeroda da pagina
 * @param {string} pageLength total de dados a retonar
 * @param {string} dateInit data inicial
 * @param {string} dateFinish data final
 * @returns Organiza os dados em um único array
 */

/**
 * @param {{ uasg: any; edital: any; pagina: any; dt_inicio: any; dt_fim: any;  }} dataBody
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { data?: any[]; total_biddings?: number; total_pages?: any; error?: any; }): void; new (): any; }; }; }} dataBody
 */
async function getDataBidding(dataBody) {
  try {
    const { pagina, dt_inicio, dt_fim } = dataBody;

    let data = [];
    let total = 0;
    //const totalPagesBiddings = await totalBiddings(dt_inicio, dt_fim);
    const totalPageComprasnet = 0;// totalPagesBiddings || 0;

    //data.push(await getDataBiddingsComprasnet(dataBody));
    //console.log("finalizou comprasnet antigo");
    //await getDataPCNP("7", "1000", dt_inicio, dt_fim)

    if (pagina <= 1 && dt_inicio !== "") {
      const dataSetFinish = await Promise.all([
        // getDataBiddingsComprasnet(dataBody),
        dataSetPortalComprasPublicas(dataBody, 1),
        getDataPCNP("1", "1000", dt_inicio, dt_fim),
      ]);
      data = dataSetFinish.flatMap((f) => f);
      console.log("finalizou");
    }
    return { data, total, total_pages: totalPageComprasnet };
  } catch (error) {
    console.error(error.message, "getDataBidding");
    return [];
  }
}

// const getDataBiddingsComprasnet = async (
//   /** @type {{ uasg: any; edital: any; pagina: any; dt_inicio: any; dt_fim: any; }} */ dataBody
// ) => {
//   try {
//     const { uasg, edital, pagina, dt_inicio, dt_fim } = dataBody;
//     let pg = `${pagina}`;
//     let data = [];
//     const promiseDados = [];
//     const url = urlGetBiddingComprasnet(dt_inicio, dt_fim, pg, uasg, edital);
//     promiseDados.push(
//       axios.get(url).then((html) => {
//         const $ = chr.load(html.data);

//         const dadosComprasnet = [];
//         $(".tex3")
//           .children("td")
//           // @ts-ignore
//           .each((i, el) => {
//             const extractNumUasg = $(el)
//               .find("b:nth-child(1)")
//               .text()
//               .replace(/[^0-9]/g, "");
//             const uasg = extractNumUasg.substring(extractNumUasg.length - 6);
//             const extractNumPregao = $(el)
//               .find("b:nth-child(3)")
//               .text()
//               .replace(/[^a-zA-Z0-9]/g, "");
//             const dados = {
//               uasg,
//               edital: extractNumPregao
//                 .substring(10, 24)
//                 .replace(/[a-zA-Z]/g, ""),
//             };
//             dadosComprasnet.push(dados);
//           });
//         //console.log(dadosComprasnet);
//         return dadosComprasnet;
//       })
//     );

//     const dataNewComprasnet = (await Promise.all(promiseDados)).flatMap(
//       (x) => x
//     );

//     const filterDataSet = dataNewComprasnet.map(async (response) => {
//       const result = await getBiddingsNoticesPNCPForUasg(response.uasg);
//       const ds = result?.biddings.flatMap((x) => x);
//       const filterData = ds?.filter((d) => d.edital.includes(response.edital));
//       return filterData;
//     });

//     const biddingPromise = await Promise.all(filterDataSet);

//     const result = biddingPromise.flatMap((f) => f);

//     const dataSet = [];

//     if (result.length > 0) {
//         for (let i = 0; i < result.length; i++) {
//       //     // @ts-ignore
//       //console.log(result[0].code_pncp)
//       const ds = await getDataBiddingPortalPncp(result[i].code_pncp);

//       if (ds) {
//         dataSet.push(ds[0]);
//       }
//        }
//       if (dataSet.length > 0 || dataSet !== undefined) {
//         data = dataSet.filter((data) => data !== undefined);
//       }
//     }
//     const data_set = data.flatMap((data) => data);
//     //console.log(data_set)
//     return data_set;
//   } catch (error) {
//     console.log(error.message, "getDataBiddingsComprasnet");
//   }
// };

/**
 * @returns  o número total de paginas encontradas no comprasnet antigo
 * @param {string} dt_inicio
 * @param {string} dt_fim
 *
 */
// async function totalBiddings(dt_inicio, dt_fim) {
//   const url = urlGetBiddingComprasnet(dt_inicio, dt_fim, "1", "", "");
//   const data = await axios.get(url).then((html) => {
//     const $ = chr.load(html.data, { decodeEntities: false });
//     const textTotalBiddings = $(".td_titulo_campo").text();
//     const totalBiddings = textTotalBiddings
//       .substring(textTotalBiddings.length - 6, textTotalBiddings.length)
//       .replace(/[^0-9]/g, "")
//       .trim();

//     const total = parseInt(totalBiddings);
//     const totalPage = Math.ceil(total / 10);
//     return totalPage;
//   });

//   return data;
// }

/**
 *
 * @param {string} dataInicio  Data Inicial
 * @param {string} dataFim  Data final
 * @param {string} num_pg  Numero da pagina
 * @param {string} numUasg Numero da uasg
 * @param {string} numPregao  Numero do pregao
 * @returns retorna a URL formatada site comprasnet
 */
// const urlGetBiddingComprasnet = (
//   dataInicio,
//   dataFim,
//   num_pg,
//   numUasg,
//   numPregao
// ) => {
//   try {
//     const date_init = dataInicio;
//     const date_finish = dataFim;
//     const num_page = num_pg;
//     const num_bidding = numPregao;
//     const num_uasg = numUasg;
//     const items = []; // [
//     const url = `http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Relacao.asp?dt_publ_ini=${date_init}&dt_publ_fim=${date_finish}&chkModalidade=5&numpag=${num_page}&Origem=F&numprp=${num_bidding}&optTpPesqMat=M&optTpPesqServ=N&txtlstUasg=${num_uasg}&txtlstMaterial=`;

//     return url;
//   } catch (error) {
//     console.log(error.message, "function getUrl");
//     return error.message;
//   }
// };

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

    if (data.total > 0) {
      // @ts-ignore
      for (let i = 0; i < data?.biddings?.length; i++) {

        // @ts-ignore
        ds.push(await getDataBiddingPortalPncp(data.biddings[i].code_pncp));

      }

      //@ts-ignore
      const dataSet = ds.flatMap((x) => x);
      // console.log(dataSet[0])
      return dataSet;
    }
  } catch (error) {
    console.log(error.message, "getDataPCNP");
    //return [];
  }
};

/**
 * @param {any} uasg
 */
// async function getBiddingsNoticesPNCPForUasg(uasg) {
//   try {
//     const url = `https://pncp.gov.br/api/search/?q=${uasg}&tipos_documento=edital&ordenacao=-data&pagina=1&tam_pagina=100&status=recebendo_proposta`;
//     const response = await axios
//       .get(url)
//       .then((result) => {
//         /** @type {Data} */

//         const data = {
//           items: result.data.items,
//           total: result.data.total,
//         };
//         return data;
//       })
//       .catch((error) => {
//         console.log(error.message, "getBiddingsNoticesPNCPForUasg");
//         //return [];
//       });
//     /**
//      * @type {number} total
//      */
//     const total = parseInt(response.total) ?? 0;
//     //console.log(response.items)
//     /** @type {Array<BidItem>} */
//     const biddings = response?.items?.map(
//       (
//         /** @type {{ orgao_cnpj: string; title: string; orgao_nome: string; numero_sequencial: string;ano:string; numero_controle_pncp:string }} */ item
//       ) => {
//         /**
//          * @type {BidItem}
//          */
//         const bidding = {
//           cnpj: item.orgao_cnpj,
//           edital: String(item.title)
//             .replace(/[^0-9]/gi, "")
//             .trim(),
//           orgao: item.orgao_nome,
//           numero_sequencial: item.numero_sequencial,
//           ano: item.ano,
//           code_pncp: item.numero_controle_pncp,
//         };

//         return bidding;
//       }
//     );
//     return { biddings, total };
//   } catch (error) {
//     console.log(error.message, "getBiddingsNoticesPNCPForUasg");
//     return []
//   }
// }

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
          total: dataBidding.length,//result.data.total,
        };
        // console.log(data.items.length, data.total)
        return data;
      })
      .catch((error) => {
        console.log(error.message, 'Funcao: getBiddingsNoticesPNCP');
        //return error.message;
      });
    /**
     * @type {number} total
     */
    const total = parseInt(response.total) ?? 0;
    //console.log(total)
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
        //console.log(bidding)
      }
    );
    return { biddings, total };
  } catch (error) {
    console.log(error.message, "getBiddingsNoticesPNCP");
    //return { msg: error.message };
  }
}

module.exports = {
  getDataBidding,
};

//getDataBiddingsComprasnet({ uasg: '', edital: '', pagina: 1, dt_inicio: '23/05/2024', dt_fim: '23/05/2024' })