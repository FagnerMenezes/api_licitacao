const axios = require("axios");
const chr = require("cheerio");
const { v4: ID } = require("uuid");
const { StatusCodes } = require("http-status-codes");

const { getDataBiddingPortalPncp } = require("../services/getBiddingsPncp");
const {
  dataSetPortalComprasPublicas,
} = require("../models/portalComprasPublicas/getBiddings");

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwiYXVkIjpbImh0dHA6Ly9sb2NhbC5hcGkuZWZmZWN0aS5jb20uYnIiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwic3ViIjoxNjIzODUzNjUzMDI5LCJjb21wYW55Ijo1MjQsInByb2ZpbGVzIjpbMV19.GwOlJhO4010BlRP9yduRyLkgmNj-DiuHrYqveQHdtfs";

/**
 * @param {string} dt_inicio
 * @param {string} dt_fim
 */
async function totalBiddings(dt_inicio, dt_fim) {
  const data = await axios.default
    // @ts-ignore
    .get(urlGetBiddingComprasnet(dt_inicio, dt_fim, 1, "", ""), {
      responseType: "json",
      // @ts-ignore
      charset: "utf-8",
      responseEncodig: "utf-8",
    })
    .then((html) => {
      const $ = chr.load(html.data, { decodeEntities: false });
      const textTotalBiddings = $(".td_titulo_campo").text();
      const totalBiddings = textTotalBiddings
        .substring(textTotalBiddings.length - 6, textTotalBiddings.length)
        .replace(/[^0-9]/g, "")
        .trim();

      const total = parseInt(totalBiddings);
      // @ts-ignore
      const totalPage = Math.ceil(parseFloat(total / 10));

      return totalPage;
    });
  return data;
}
/**
 * @param {{ body: { uasg: any; edital: any; pagina: any; dt_inicio: any; dt_fim: any; }; }} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { data?: any[]; total_biddings?: number; total_pages?: any; error?: any; }): void; new (): any; }; }; }} res
 */
async function getDataBiddings(req, res) {
  const { uasg, edital, pagina, dt_inicio, dt_fim } = req.body;
  let total = 0;
  // @ts-ignore
  // @ts-ignore

  try {
    const totalPagesBiddings = await totalBiddings(dt_inicio, dt_fim);
    const totalPageComprasnet = totalPagesBiddings || 0;
    console.log("Total de pagínas:", totalPageComprasnet);
    console.log("Pagina:", pagina);
    let data = [];
    // @ts-ignore
    let pg = `${pagina}`;
    const promiseDados = [];

    promiseDados.push(
      axios.default
        .get(urlGetBiddingComprasnet(dt_inicio, dt_fim, pg, uasg, edital))
        .then((html) => {
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
    //console.log("terminou busca no portal antigo comprasnet");

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
        // @ts-ignore
        const ds = await getDataBiddingPortalPncp(result[i].code_pncp);
        if (ds) {
          dataSet.push(ds[0]);
        }
      }
      if (dataSet.length > 0) {
        data = dataSet;
      }
    }
    console.log("finalizou comprasnet");
    if (pagina <= 1 && dt_inicio !== "") {
      const dataSetFinish = await Promise.all([
        dataSetPortalComprasPublicas(req.body, 1),
        getDataPCNP("1", "1000", dt_inicio, dt_fim),
      ]);
      data = dataSetFinish.flatMap((f) => f);
      console.log("finalizou pncp e compras publicas");

      //const dataPncp = await getDataPCNP("1", "1000", dt_inicio, dt_fim);
      //data = dataPncp || [];

      // const dataSetComprasPublicas = await dataSetPortalComprasPublicas(
      //  req.body,
      //   1
      // );

      // dataSetComprasPublicas.map((result) => data.push(result));
    }
    console.log("finalizou");
    res
      .status(StatusCodes.OK)
      .json({ data, total_biddings: total, total_pages: totalPageComprasnet });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
}
// @ts-ignore
/**
 * @param {{ query: { n_uasg: any; n_pregao: any; n_page: any; }; }} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { items?: { itens: any[]; totalItems: any; totalPages: any; error?: undefined; } | { error: any; itens?: undefined; totalItems?: undefined; totalPages?: undefined; }; error?: any; }): void; new (): any; }; }; }} res
 * @param {any} next
 */
// @ts-ignore
async function getItemsBiddings(req, res, next) {
  try {
    const uasg = req.query.n_uasg;
    const pregao = req.query.n_pregao;
    const page = req.query.n_page;
    await extractItemsBidding(uasg, pregao, page).then((data) => {
      res.status(200).json({ items: data });
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

/**
 *
 * @param {string} dataInicio  Data Inicial
 * @param {string} dataFim  Data final
 * @param {string} num_pg  Numero da pagina
 * @param {string} numUasg Numero da uasg
 * @param {string} numPregao  Numero do pregao
 * @returns
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
    //1147, 1157, 37044, 1179, 1036, 9409, 12434, 12183, 13306, 10424, 7868,
    // 19790, 6754, 14901, 16254, 1034, 6754, 18330, 13770, 18372,
    // ];

    //10424 -> PARAFUSADEIRA
    //7868 -> FURADEIRA
    //19790 -> POLPA DE FRUTA
    //569   -> DISCO DESBASTE
    //14901 -> 	DISCO CORTE
    //16254 -> ELETRODO
    //1034 -> TRANSFORMADOR SOLDAGEM
    //6754 -> COMPRESSOR
    //12183 -> SOLDA
    //18330 -> REGULADOR -
    //13770  -> REGULADOR PRESSÃO
    //18372  -> CILINDRO
    //1147   -> ARAME SOLDA
    //3533   -> BICO SOLDAGEM
    //1157   -> ELETRODO SOLDA
    //6697   -> EQUIPAMENTO DE FONTE DE SOLDA
    //12434  -> PEÇAS E ACESSÓRIOS SOLDA
    //1179   -> MÁQUINA SOLDA
    //37044  -> Equipamento e Acessórios de Solda    const num_uasg = numUasg;

    const url = `
http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Relacao.asp?
dt_publ_ini=${date_init}&
dt_publ_fim=${date_finish}&
chkModalidade=5&
numpag=${num_page}&
Origem=F&
numprp=${num_bidding}&
optTpPesqMat=M&
optTpPesqServ=N&
txtlstUasg=${num_uasg}&
txtlstMaterial=${items}`;
    //console.log(url);
    return url;
  } catch (error) {
    return error.message;
  }
};
/**
 *
 * @param {string} uasg - Código da uasg
 * @param {string} pregao - Numero do pregão
 * @param {string | any} pagina - Numero do pagina
 * @returns
 */
const extractItemsBidding = async (uasg, pregao, pagina) => {
  try {
    const $ = await htmlItemsBidding(uasg, pregao, pagina).then(
      (response) => response
    );

    const itens = [];
    const data = $("br + .tex3");
    const { totalItems, totalPages } = await totalPageAndItems(
      uasg,
      pregao,
      1
    ).then((result) => result);

    let amountItems = $(".tex3b + table > tbody > tr").length;

    if (pagina > 1) {
      amountItems -= 1;
    }

    data.each(
      (
        /** @type {number} */ i,
        /** @type {{ children: { data: any; }[]; prev: { prev: { children: any[]; }; }; }} */ el
      ) => {
        if (i >= amountItems) return;
        const descriptionItems = [];
        descriptionItems.push(String(el.children[0].data).normalize("NFC"));
        const keywords = [
          "ELETRODO",
          "ARAME",
          "ELETRODOS",
          "SOLDA",
          "SOLDAGEM",
          "DISCO",
          "PARAFUSADEIRA",
          "TOCHA",
          "COMPRESSOR",
          "REGULADOR",
          "CILINDRO",
          "FURADEIRA",
          "EQUIPAMENTOS",
          "VARETA",
        ];
        //console.log(descriptionItems);
        const filteredDescriptionItems = descriptionItems.filter((item) => {
          return keywords.some((keyword) =>
            item.toUpperCase().includes(keyword)
          );
        });

        if (filteredDescriptionItems.length <= 0) return;

        const item = {
          _id: ID(),
          cod: String($(el.prev.prev.children[0]).text()).replace(
            /[^0-9]/gim,
            ""
          ),
          lote: "",
          amount:
            parseInt(String(el.children[8].data).replace(/[^0-9]/g, "")) || "",
          unit: String(el.children[10].data)
            .replace("Unidade de fornecimento: ", "")
            .trim(),
          description: el.children[0].data,
          brand: "",
          model: "",
          unitary_value: {
            $numberDecimal: "0",
          },
          value_reference: {
            $numberDecimal: "0",
          },
          winner: "false",
          item_balance: 0,
          origination: "",
        };
        // console.log(item);
        itens.push(item);
      }
    );

    return { itens, totalItems, totalPages };
  } catch (error) {
    //console.error("Error", error.message);
    return { error: error.message };
  }
};
/**
 *
 * @param {string} uasg - Código da uasg
 * @param {string} pregao - Numero do pregão
 * @param {string} pagina - Numero do pagina
 * @returns
 */
const htmlItemsBidding = async (uasg, pregao, pagina) => {
  try {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    let bodyContent = `tipo=M&paginaVoltar=&txbIrPara=${pagina}&pagina=${pagina}`;

    let reqOptions = {
      url: `http://comprasnet.gov.br/ConsultaLicitacoes/download/download_editais_detalhe.asp?coduasg=${uasg}&modprp=5&numprp=${pregao}`,
      method: "POST",
      headersList,
      data: bodyContent,
    };
    // @ts-ignore
    let response = await axios.request(reqOptions);
    // console.log(response);
    const $ = chr.load(response.data);
    return $;
  } catch (error) {
    return error.message;
  }
};
// @ts-ignore
const totalPageAndItems = async (
  /** @type {string} */ uasg,
  /** @type {string} */ pregao,
  // @ts-ignore
  /** @type {number} */ pagina
) => {
  try {
    const $ = await htmlItemsBidding(uasg, pregao, "1").then((result) => {
      return result;
    });
    const amountItems = $(".tex3b + table > tbody > tr").length;
    //console.log(amountItems);
    const test = String($(".tex3").text()).includes(
      "Quantidade Total de Itens:"
    );
    let totalItems = "";
    if (test) {
      const text = String($(".tex3").text()).match(
        /Quantidade Total de Itens:\s[0-9]{2,}/gim
      );
      const textTotalPage = String($(".tex3").text()).match(
        /P\ufffdgina\s[0-9]+\sde\s[0-9]+/gim
      );
      // @ts-ignore
      totalItems = String(text[0].replace(/[^0-9]/gim, ""));
      // @ts-ignore
      const totalPages = textTotalPage[0].replace(/[^0-9]/gim, "").substring(1);
      return {
        totalItems: parseInt(totalItems),
        totalPages: parseInt(totalPages),
      };
    } else {
      totalItems = amountItems;
    }
    return { totalItems: parseInt(totalItems), totalPages: 1 };
  } catch (error) {
    return error;
  }
};
// @ts-ignore
// const extractNameGovernment = async (/** @type {any} */ uasg) => {
//   // let nameGovernment = "";
//   //const url = `http://comprasnet.gov.br/livre/uasg/Catalogo_Resp.asp`;
//   // let headersList = {
//   //   Accept: "*/*",
//   //   "Content-Type": "application/x-www-form-urlencoded",
//   // };
//   // let bodyContent = `codigo=${uasg}`;

//   // let reqOptions = {
//   //   url: "http://comprasnet.gov.br/livre/uasg/Catalogo_Resp.asp",
//   //   method: "POST",
//   //   headers: headersList,
//   //   data: bodyContent,
//   // };
//   // @ts-ignore
//   //let response = await axios.request(reqOptions);
//   let response = await axios.default.get(
//     "http://comprasnet.gov.br/livre/uasg/Catalogo_Resp.asp"
//   );

//   const $ = chr.load(response.data);

//   const table = $(".td");
//   const tableData = [];

//   // Iterando sobre as linhas da tabela
//   $(table)
//     .find("tr")
//     .slice(1)
//     // @ts-ignore
//     .each((i, row) => {
//       // Objeto para armazenar os dados de cada linha
//       const rowData = {};

//       // Iterando sobre as colunas da linha
//       $(row)
//         .find("td")
//         .each((j, cell) => {
//           // Adicionando o conteúdo da célula ao objeto rowData
//           rowData[`column_${j}`] = $(cell).text().trim();
//         });

//       // Adicionando os dados da linha ao array tableData
//       tableData.push(rowData);
//     });

//   // nameGovernment = String(
//   //   $(".td").find("tr:nth-child(2)>td:nth-child(2)").text()
//   // ).replace(/\s\n/g, "");
//   //console.log(tableData[0]);
//   //return nameGovernment;
//   return tableData;
// };

/**
 * @param {{ body: any; }} req
 * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: any): void; new (): any; }; }; }} res
 */
async function registerProposalComprasnet(req, res) {
  //console.log(req.body);
  try {
    const url =
      "https://mdw.minha.effecti.com.br/api-integracao/v1/proposta/comprasnet";
    const authorization = "Bearer " + token;
    const headersList = {
      Accept: "*/*",
      Authorization: authorization,
      "Content-Type": "application/json",
    };
    //const data = JSON.stringify(req.body);
    const bodyContent = req.body;
    const reqOptions = {
      url: url,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    // @ts-ignore
    // @ts-ignore
    const response = await axios.default
      .request(reqOptions)
      .then((response) => {
        // console.log(response);
        return res.status(200).json(response.data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err.response);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/************************LICITAÇÕES PNCP******************************/

async function getBiddingsNoticesPNCPForUasg(uasg) {
  try {
    const url = `https://pncp.gov.br/api/search/?q=${uasg}&tipos_documento=edital&ordenacao=-data&pagina=1&tam_pagina=100&status=recebendo_proposta`;
    const response = await axios.default
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
        console.log(error);
        return error.message;
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
    console.log(error);
  }
}

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
async function getBiddingsNoticesPNCP(
  pagina,
  // @ts-ignore
  pageLength,
  dateInit,
  // @ts-ignore
  dateFinish
) {
  try {
    const url = `https://pncp.gov.br/api/search/?q=SOLDA&tipos_documento=edital&ordenacao=-data&pagina=${pagina}&tam_pagina=1000&status=recebendo_proposta&modalidades=6|8`;
    const response = await axios.default
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
          total: result.data.total,
        };
        return data;
      })
      .catch((error) => {
        console.log(error);
        return error.message;
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
    console.log(error);
  }
}
/**
 * @description Obtém todos os dados da licitação
 * @param {string} pagina numeroda da pagina
 * @param {string} pageLength total de dados a retonar
 * @param {string} dateInit data inicial
 * @param {string} dateFinish data final
 * @returns Organiza os dados em um único array
 */
const getDataPCNP = async (pagina, pageLength, dateInit, dateFinish) => {
  try {
    const data = await getBiddingsNoticesPNCP(
      pagina,
      pageLength,
      dateInit,
      dateFinish
    );
    // @ts-ignore
    const ds = [];

    if (data) {
      for (let i = 0; i < data.biddings.length; i++) {
        ds.push(await getDataBiddingPortalPncp(data.biddings[i].code_pncp));
      }
      // @ts-ignore
      return ds.flatMap((x) => x);
    }
    // return [];
  } catch (error) {
    console.log(error);
    return [{ error }];
  }
};
/**
 * @description converte  uma data no formato DD/MM/AAAA para AAAA-MM-DD
 * @param {string} data data no formato DD/MM/AAAA
 * @returns retorna a data formatada
 */
function converterData(data) {
  // Dividir a string da data em partes (dia, mês e ano) usando a barra como separador
  const partes = data.split("/");
  // Reorganizar as partes no formato AAAA-MM-DD
  const dataFormatada =
    partes[2] +
    "-" +
    partes[1].padStart(2, "0") +
    "-" +
    partes[0].padStart(2, "0");
  return dataFormatada;
}
/**
 *
 * @param {{ body: any; }} req
 * @param {*} res
 */
const getDataBiddingsPncp = async (req, res) => {
  try {
    const data = await getDataBiddingPortalPncp(req.body.codePncp);
    //console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Erro ao solicitar os dados" });
  }
};

module.exports = {
  getDataBiddings,
  getItemsBiddings,
  registerProposalComprasnet,
  getDataBiddingsPncp,
};
