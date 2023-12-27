const axios = require("axios");
const chr = require("cheerio");
const { v4: ID } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const { getDataBiddingPortalBec } = require("./getDataBiddingBec");
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwiYXVkIjpbImh0dHA6Ly9sb2NhbC5hcGkuZWZmZWN0aS5jb20uYnIiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwic3ViIjoxNjIzODUzNjUzMDI5LCJjb21wYW55Ijo1MjQsInByb2ZpbGVzIjpbMV19.GwOlJhO4010BlRP9yduRyLkgmNj-DiuHrYqveQHdtfs";

async function totalBiddings(dt_inicio, dt_fim) {
  const data = await axios.default
    .get(urlGetBiddingComprasnet(dt_inicio, dt_fim, 1, "", ""), {
      responseType: "json",
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
      const totalPage = Math.ceil(parseFloat(total / 10));

      return totalPage;
    });
  return data;
}
async function getDataBiddings(req, res) {
  //console.log(req.body);
  const { uasg, edital, pagina, dt_inicio, dt_fim } = req.body;
  let total = "";
  let totalPage = "";
  const biddings = [];
  try {
    const totalPagesBiddings = await totalBiddings(dt_inicio, dt_fim);
    let dataBiddings = [];
    let data = [];
    let count = 1;
    for (let i = count; i <= 1; i++) {
      const dataBidding = await axios.default
        .get(urlGetBiddingComprasnet(dt_inicio, dt_fim, pagina, uasg, edital), {
          responseType: "json",
          charset: "utf-8",
          responseEncodig: "utf-8",
        })
        .then((html) => {
          const $ = chr.load(html.data, { decodeEntities: false });
          const data = [];
          const textTotalBiddings = $(".td_titulo_campo").text();
          const totalBiddings = textTotalBiddings
            .substring(textTotalBiddings.length - 6, textTotalBiddings.length)
            .replace(/[^0-9]/g, "")
            .trim();
          //console.log(totalBiddings);
          total = parseInt(totalBiddings);
          totalPage = Math.ceil(parseFloat(total / 10));

          $(".tex3")
            .children("td")
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

              const extract_data_hs = String(el.children[23].data).replace(
                /[^0-9]/g,
                ""
              );
              const extract_data = String(el.children[8].data).replace(
                /[^0-9]/g,
                ""
              );
              const address = String(el.children[11].data);
              const city = String(el.children[11].data)
                .replace(/\ufffd/gim, "")
                .match(
                  /([a-z]{2,}\s)?([a-z]{2,}\s)?([a-z]{2,}\s)?([a-z-0-9]{2,}\s\([a-z]{2}\))/gim
                );
              const biddings = {
                _id: ID(),
                government: [
                  {
                    _id: ID(),
                    cnpj: "000000000",
                    name: "",
                    code_government: uasg,
                    manager: true,
                    address: [
                      {
                        _id: ID(),
                        zip_code: "",
                        complement: "",
                        street: el.children[11].data,
                        number: String(el.children[11].data)
                          .toUpperCase()
                          .substring(
                            String(el.children[11].data).indexOf(","),
                            String(el.children[11].data).indexOf(",") + 10
                          )
                          .replace(/[^0-9]/g, "")
                          .trim(),
                        district: "",
                        city: String(city)
                          .substring(0, String(city).length - 4)
                          .trim(),
                        type_address: "LICITAÇÃO",
                        uf: String(el.children[11].data)
                          .substring(
                            String(address).length - 4,
                            String(address).length
                          )
                          .replace(/[^a-zA-Z]/g, "")
                          .trim(),
                      },
                    ],
                    contact: [
                      {
                        _id: ID(),
                        name: "COMPRAS",
                        sector: "LICITAÇÃO",
                        contact: String(el.children[14].data).replace(
                          /[^0-9]/g,
                          ""
                        ),
                        tipo: "TEL",
                      },
                    ],
                  },
                ],
                reference_term: {
                  validity: "",
                  guarantee: "",
                  deadline: "",
                  itens: [],
                },
                process_data: {
                  status: "Cadastrar proposta",
                  type_dispute: "Menor preço unitário",
                  modality: "PE",
                  portal: "COMPRASNET",
                  n_process: extractNumPregao
                    .substring(10, 22)
                    .replace(/[a-zA-Z]/g, ""),
                  bidding_notice: extractNumPregao
                    .substring(10, 22)
                    .replace(/[a-zA-Z]/g, ""),
                  date_finish:
                    extract_data_hs.substring(4, 8) +
                    "-" +
                    extract_data_hs.substring(2, 4) +
                    "-" +
                    extract_data_hs.substring(0, 2),
                  object: String(el.children[5].data).trim(),
                  hours_finish:
                    extract_data_hs.substring(8, 10) +
                    ":" +
                    extract_data_hs.substring(10, 12),
                  date_init: String(el.children[20].data)
                    .replace(/[^0-9]/gim, "")
                    .substring(0, 8)
                    .replace(/([0-9]{2})([0-9]{2})([0-9]{4})/g, "$3-$2-$1")
                    .trim(),
                },
              };
              data.push(biddings);
            });
          dataBiddings.push(...data);
          //console.log(dataBiddings,i);
          return dataBiddings;
        });
      data = dataBidding;
    }
    // console.log("finalizou", "dados licitação");

    for (let i = 0; i < data.length; i++) {
      const uasg = data[i].government[0].code_government;

      const nameGovernment = await extractNameGovernment(uasg).then((data) => {
        return data;
      });

      data[i].government[0].name = nameGovernment.replace(/\n/g, "").trim();
    }
    //console.log("finalizou", "dados orgao");
    for (let i = 0; i < data.length; i++) {
      const uasg = data[i].government[0].code_government;
      const pregao = data[i].process_data.bidding_notice;
      const { totalPages, totalItems } = await extractItemsBidding(
        uasg,
        pregao,
        1
      ).then((data) => data);
      const item = [];
      for (let t = 1; t <= parseInt(totalPages); t++) {
        const itens = await extractItemsBidding(uasg, pregao, t).then(
          (data) => {
            item.push(...data.itens);
            return item;
          }
        );
        //console.log(itens);
        data[i].reference_term.itens = itens; //items;
      }
    }
    console.log("finalizou", "itens");

    if (uasg === "" && edital === "") {
      const pncp = await getDataPCNP(pagina);
      pncp.map((item) => {
        const result = {
          _id: item._id,
          process_data: item.process_data,
          government: item.government,
          reference_term: item.reference_term,
        };
        data.push(result);
      });
    }

    if (pagina === 1 && uasg === "") {
      const dataBiddingBec = await getDataBiddingPortalBec();
      console.log(pagina);
      dataBiddingBec.map((item) => {
        data.push({ ...item });
      });
    }

    res
      .status(StatusCodes.OK)
      .json({ data, total_biddings: total, total_pages: totalPage });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: error.message });
  }
}
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
 * @param {string} dataInicio - Data Inicial
 * @param {string} dataFim - Data final
 * @param {string} num_pg - Numero da pagina
 * @param {string} numUasg- Numero da uasg
 * @param {string} numPregao - Numero do pregao
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
 * @param {string} pagina - Numero do pagina
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

    data.each((i, el) => {
      if (i >= amountItems) return;
      const descriptionItems = [];
      descriptionItems.push(String(el.children[0].data));
      const keywords = [
        "ELETRODO",
        "ARAME MIG",
        "ELETRODOS",
        "SOLDA",
        "SOLDAGEM",
        "DISCO DE CORTE",
        "PARAFUSADEIRA",
        "TOCHA",
        "COMPRESSOR",
        "REGULADOR",
        "CILINDRO",
        "FURADEIRA",
      ];

      const filteredDescriptionItems = descriptionItems.filter((item) => {
        return keywords.some((keyword) => item.toUpperCase().includes(keyword));
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

      itens.push(item);
    });

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
    let response = await axios.request(reqOptions);
    // console.log(response);
    const $ = chr.load(response.data);
    return $;
  } catch (error) {
    return error.message;
  }
};
const totalPageAndItems = async (uasg, pregao, pagina) => {
  try {
    const $ = await htmlItemsBidding(uasg, pregao, 1).then((result) => {
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
      totalItems = String(text[0].replace(/[^0-9]/gim, ""));
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
const extractNameGovernment = async (uasg) => {
  let nameGovernment = "";
  //const url = `http://comprasnet.gov.br/livre/uasg/Catalogo_Resp.asp`;

  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let bodyContent = `codigo=${uasg}`;

  let reqOptions = {
    url: "http://comprasnet.gov.br/livre/uasg/Catalogo_Resp.asp",
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  let response = await axios.request(reqOptions);

  const $ = chr.load(response.data);
  nameGovernment = String(
    $(".td").find("tr:nth-child(2)>td:nth-child(2)").text()
  ).replace(/\s\n/g, "");
  return nameGovernment;
};
async function registerProposalComprasnet(req, res) {
  // console.log(req.body);
  try {
    const url =
      "https://mdw.minha.effecti.com.br/api-integracao/v1/proposta/comprasnet";
    const authorization = "Bearer " + token;
    const headersList = {
      Accept: "*/*",
      Authorization: authorization,
      "Content-Type": "application/json",
    };
    const bodyContent = req.body;
    //console.log(bodyContent);
    const reqOptions = {
      url: url,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    const response = await axios.default
      .request(reqOptions)
      .then((response) => {
        //console.log(response);
        return res.status(200).json(response.data);
      })
      .catch((err) => {
        //console.log(err.response.data);
        return res.status(400).json(err.response);
      });
  } catch (error) {
    //console.log(error.message);
    res.status(500).json(error);
  }
}
//RETORNA TODAS AS LICITAÇÕES
async function getBiddingsNoticesPNCP(pagina) {
  try {
    const url = `https://pncp.gov.br/api/search/?q=SOLDA&tipos_documento=edital&ordenacao=-data&pagina=${pagina}&tam_pagina=10&status=recebendo_proposta&modalidades=6|8`;
    const response = await axios.default
      .get(url)
      .then((result) => {
        //console.log(result)
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
    const total = response.total;
    // console.log(response.items);
    const biddings = response.items.map((item) => {
      //const items_biddings = await axios.get();
      return {
        cnpj: item.orgao_cnpj,
        edital: String(item.title)
          .replace(/[^0-9]/gi, "")
          .trim(),
        orgao: item.orgao_nome,
        numero_sequencial: item.numero_sequencial,
      };
    });
    // console.log(biddings);
    return { biddings, total };
  } catch (error) {
    console.log(error);
  }
}
//RETORNA AS INFORMAÇÕES GERAIS DOS EDITAIS
async function getDataBiddingsPNCP(cnpj, code) {
  try {
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/2023/${code}`;
    const data = await axios.default
      .get(url)
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        //console.log(error);
        return error.message;
      });
    return data;
  } catch (error) {
    //console.log(error);
    return error;
  }
}
//RETORNA A QUANTIDADE DE ITENS
async function getBiddingsTotalItemsPNCP(cnpj, code) {
  try {
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/2023/${code}/itens/quantidade`;
    const totalItens = await axios.default
      .get(url)
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        //console.log(error);
        return error.message;
      });
    return totalItens;
  } catch (error) {
    //console.log(error);
    return error;
  }
}
//RETORNA OS ITENS
async function getBiddingsItemsPNCP(cnpj, code, amoutItems) {
  try {
    const url = `https://pncp.gov.br/api/pncp/v1/orgaos/${cnpj}/compras/2023/${code}/itens?pagina=1&tamanhoPagina=${amoutItems}`;
    const Items = await axios.default
      .get(url)
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        console.log(error);
        return error.message;
      });
    return Items;
  } catch (error) {
    console.log(error);
  }
}
const getDataPCNP = async (pagina) => {
  //console.log(pagina);
  const data = await getBiddingsNoticesPNCP(pagina);
  const dataBidding = data.biddings.slice(0, 10); // Limita a 10 itens
  const keywords = [
    "ELETRODO",
    "ARAME MIG",
    "ELETRODOS",
    "SOLDA",
    "SOLDAGEM",
    "DISCO DE CORTE",
    "PARAFUSADEIRA",
    "TOCHA",
    "COMPRESSOR",
    "REGULADOR",
    "CILINDRO",
    "FURADEIRA",
  ];
  const itensBidding = [];
  const formattedBiddings = await Promise.all(
    dataBidding.map(async (bidding) => {
      const { cnpj, numero_sequencial } = bidding;
      const element = await getDataBiddingsPNCP(cnpj, numero_sequencial);
      const totalItens = await getBiddingsTotalItemsPNCP(
        cnpj,
        numero_sequencial
      );
      const itens = await getBiddingsItemsPNCP(
        cnpj,
        numero_sequencial,
        totalItens
      );
      const items = itens.map((item) => {
        const descriptionItems = [];
        descriptionItems.push(String(item.descricao));
        const filteredDescriptionItems = descriptionItems.filter((item) => {
          return keywords.some((keyword) =>
            item.toUpperCase().includes(keyword)
          );
        });
        if (filteredDescriptionItems.length <= 0) return;
        const filterItens = {
          _id: ID(),
          cod: item.numeroItem,
          lote: "",
          amount: item.quantidade,
          unit: item.unidadeMedida,
          description: item.descricao,
          brand: "",
          model: "",
          unitary_value: item.valorUnitarioEstimado,
          value_reference: 0,
          winner: "false",
          item_balance: 0,
        };
        itensBidding.push(filterItens);
      });
      const biddings = {
        _id: ID(),
        process_data: {
          status: "Cadastrar proposta",
          type_dispute: "",
          modality: element.modalidadeNome,
          portal: "PNCP",
          n_process: element.processo,
          bidding_notice: element.numeroCompra + element.anoCompra,
          date_finish: String(element.dataEncerramentoProposta).slice(0, 10),
          date_init: String(element.dataAberturaProposta).slice(0, 10),
          hours_finish: String(element.dataEncerramentoProposta).slice(11, 17),
          object: element.objetoCompra,
        },
        government: [
          {
            _id: ID(),
            name: element.orgaoEntidade.razaoSocial,
            cnpj: element.orgaoEntidade.cnpj,
            code_government: element.unidadeOrgao.codigoUnidade,
            manager: "true",
            adress: [
              {
                id: ID(),
                type_address: "LICITACAO",
                street: "",
                number: "",
                district: "",
                zip_code: "",
                uf: element.unidadeOrgao.ufSigla,
                city: element.unidadeOrgao.municipioNome,
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
        reference_term: {
          validity: "",
          guaranteed: "",
          deadline: "",
          itens: itensBidding,
        },
      };
      return {
        biddings,
        description: itensBidding.map((item) => item.description).join(" "), // Concatena as descrições dos itens
      };
    })
  );
  return formattedBiddings.map(({ biddings }) => ({ ...biddings }));
};

module.exports = {
  getDataBiddings,
  getItemsBiddings,
  registerProposalComprasnet,
};

//SITE KEY
//93b08d40-d46c-400a-ba07-6f91cda815b9
//93b08d40-d46c-400a-ba07-6f91cda815b9
//https://newassets.hcaptcha.com/captcha/v1/7d69057/static/hcaptcha.html#frame=checkbox&id=04yljyqmjz9&host=sso.acesso.gov.br&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=off&custom=false&hl=pt-BR&tplinks=on&sitekey=93b08d40-d46c-400a-ba07-6f91cda815b9&theme=light&origin=https%3A%2F%2Fsso.acesso.gov.br&size=invisible
//`hcaptchaHabilitado: true
// hcaptchaSiteKey:"b8bbded1-9d04-4ace-9952-b67cde081a7b"
// recaptchaHabilitado: false
// recaptchaSiteKey: "6LeFY7UUAAAAANq3IRQtuH9hQFugmh_OR9OlQHaW"
// https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/captcha/configuracao`;
