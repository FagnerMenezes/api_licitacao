const axios = require("axios").default;
const chr = require("cheerio");
const { getDataBiddingPortalPncp, getBiddingsNoticesPNCPForUasg } = require("../pncp/getBiddingsPncp");

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


const getDataBiddingsComprasnet = async (
  /** @type {{ uasg: any; edital: any; pagina: any; dt_inicio: any; dt_fim: any; }} */ dataBody
) => {
  try {
    const { uasg, edital, pagina, dt_inicio, dt_fim } = dataBody;
    let pg = `${pagina}`;
    let data = [];
    const promiseDados = [];
    const url = urlGetBiddingComprasnet(dt_inicio, dt_fim, pg, uasg, edital);
    promiseDados.push(
      axios.get(url).then((html) => {
        const $ = chr.load(html.data);

        const dadosComprasnet = [];
        $(".tex3")
          .children("td")
          // @ts-ignore
          .each((i, el) => {
            const extractNumUasg = $(el)
              .find("b:nth-child(1)")
              .text()
              .replace(/[^0-9]/g, "");
            const uasg = extractNumUasg.substring(extractNumUasg.length - 6);
            const extractNumPregao = $(el)
              .find("b:nth-child(3)")
              .text()
              .replace(/[^a-zA-Z0-9]/g, "");
            const dados = {
              uasg,
              edital: extractNumPregao
                .substring(10, 24)
                .replace(/[a-zA-Z]/g, ""),
            };
            dadosComprasnet.push(dados);
          });

        return dadosComprasnet;
      })
    );

    const dataNewComprasnet = (await Promise.all(promiseDados)).flatMap(
      (x) => x
    );

    const filterDataSet = dataNewComprasnet.map(async (response) => {
      const result = await getBiddingsNoticesPNCPForUasg(response.uasg);
      const ds = result?.biddings.flatMap((x) => x);
      const filterData = ds?.filter((d) => d.edital.includes(response.edital));
      return filterData;
    });

    const biddingPromise = await Promise.all(filterDataSet);

    const result = biddingPromise.flatMap((f) => f);

    const dataSet = [];

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        //     // @ts-ignore

        const ds = await getDataBiddingPortalPncp(result[i].code_pncp);

        if (ds) {
          dataSet.push(ds[0]);
        }
      }
      if (dataSet.length > 0 || dataSet !== undefined) {
        data = dataSet.filter((data) => data !== undefined);
      }
    }
    const data_set = data.flatMap((data) => data);

    return { data: data_set, totalPages: 0 }
  } catch (error) {
    console.log(error.message, "getDataBiddingsComprasnet");
  }
};

/**
 * @returns  o número total de paginas encontradas no comprasnet antigo
 * @param {string} dt_inicio
 * @param {string} dt_fim
 *
 */
async function totalBiddings(dt_inicio, dt_fim) {
  const url = urlGetBiddingComprasnet(dt_inicio, dt_fim, "1", "", "");
  const data = await axios.get(url).then((html) => {
    const $ = chr.load(html.data, { decodeEntities: false });
    const textTotalBiddings = $(".td_titulo_campo").text();
    const totalBiddings = textTotalBiddings
      .substring(textTotalBiddings.length - 6, textTotalBiddings.length)
      .replace(/[^0-9]/g, "")
      .trim();

    const total = parseInt(totalBiddings);
    const totalPage = Math.ceil(total / 10);
    return totalPage;
  });

  return data;
}

/**
 *
 * @param {string} dataInicio  Data Inicial
 * @param {string} dataFim  Data final
 * @param {string} num_pg  Numero da pagina
 * @param {string} numUasg Numero da uasg
 * @param {string} numPregao  Numero do pregao
 * @returns retorna a URL formatada site comprasnet
 */
const urlGetBiddingComprasnet = (
  dataInicio,
  dataFim,
  num_pg,
  numUasg,
  numPregao
) => {
  try {
    const date_init = dataInicio;
    const date_finish = dataFim;
    const num_page = num_pg;
    const num_bidding = numPregao;
    const num_uasg = numUasg;
    const items = []; // [
    const url = `http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Relacao.asp?dt_publ_ini=${date_init}&dt_publ_fim=${date_finish}&chkModalidade=5&numpag=${num_page}&Origem=F&numprp=${num_bidding}&optTpPesqMat=M&optTpPesqServ=N&txtlstUasg=${num_uasg}&txtlstMaterial=`;

    return url;
  } catch (error) {
    console.log(error.message, "function getUrl");
    return error.message;
  }
};




module.exports = {
  getDataBiddingsComprasnet,
};

//getDataBiddingsComprasnet({ uasg: '', edital: '', pagina: 1, dt_inicio: '23/05/2024', dt_fim: '23/05/2024' })