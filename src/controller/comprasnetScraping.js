//URL PARA PEGAR AS MENSAGENS
//http://comprasnet.gov.br/livre/Pregao/Mensagens_Sessao_Publica.asp?prgCod=1115273
//URL AVISOS
//http://comprasnet.gov.br/livre/Pregao/avisos1.asp?prgCod=1124550&Origem=Avisos&Tipo=A
//URL POST AVISOS
//http://comprasnet.gov.br/livre/Pregao/lista_pregao.asp
//URL CHAT
//http://comprasnet.gov.br/livre/Pregao/Mensagens_Sessao_Publica.asp?prgCod=1124550

//const puppeteer = require("puppeteer");
//const puppeteer = require("puppeteer-extra");
const axios = require("axios");
const chr = require("cheerio");
const { v4: ID } = require("uuid");
//const { errors } = require("puppeteer-core");
//const { response } = require("express");
//const { decodeBase64 } = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

// const config = {
//   sitekey: "93b08d40-d46c-400a-ba07-6f91cda815b9",
//   pageurl: "https://www.gov.br/pt-br",
//   apiKey: "ec8254f0e237492c8bd5e74ce3948eb4",
//   apiSubmitUrl: "http://2captcha.com/in.php",
//   apiRetrieveUrl: "http://2captcha.com/res.php",
// };

// const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
// puppeteer.use(
//   RecaptchaPlugin({
//     provider: {
//       id: "2captcha",
//       token: "ec8254f0e237492c8bd5e74ce3948eb4", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
//     },
//     visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
//   })
// );

// async function urlGetWarnings(prgCod) {
//   return `http://comprasnet.gov.br/livre/Pregao/avisos1.asp?prgCod=${prgCod}&Origem=Avisos&Tipo=E`;
// }

// async function urlPostWarnings(co_uasg, numprp) {
//   return `http://comprasnet.gov.br/livre/Pregao/lista_pregao.asp?Opc=0&txtlstUasg=&rdTpPregao=E&lstSrp=T&lstICMS=T&lstSituacao=5&lstTipoSuspensao=0&uf=&co_uasg=${co_uasg}&numprp=${numprp}&dt_entrega=&dt_abertura=`;
// }

// async function getPrgCode() {
//   const dados = {
//     pregao: "152023", //"372023", //req.params.numprpm,52023
//     uasg: "985915", //"986563", //req.params.co_uasg927190
//   };
//   const prgCod = await axios.default
//     .get(await urlPostWarnings(dados.uasg, dados.pregao))
//     .then((html) => {
//       const $ = chr.load(html.data);
//       const result = $("a").attr("onclick");
//       const prgCod_ = result.replace(/[a-z-'(),_;]/gim, "").trim();
//       return prgCod_;
//     })
//     .catch((error) => {
//       console.error(error.message);
//     });
//   return prgCod;
// }

// async function getUrlMain() {
//   const url = await axios.default
//     .get(
//       `http://comprasnet.gov.br/livre/Pregao/avisos1.asp?prgCod=${await getPrgCode()}&Origem=Avisos&Tipo=E`
//     )
//     .then((html) => {
//       const $ = chr.load(html.data);
//       const result = $("#q20").attr("src");
//       const response = "http://comprasnet.gov.br/livre/Pregao/" + result;
//       return response.toString();
//     })
//     .catch((error) => {
//       console.error(error.message);
//       res.send("error: " + error);
//     });
//   return url;
// }

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
  const { uasg, edital, pagina, dt_inicio, dt_fim } = req.body;
  let total = "";
  let totalPage = "";
  const biddings = [];
  try {
    const totalPagesBiddings = await totalBiddings(dt_inicio, dt_fim);
    console.log(pagina);
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
                government: [
                  {
                    _id: ID(),
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
    console.log("finalizou", "dados licitação");

    for (let i = 0; i < data.length; i++) {
      const uasg = data[i].government[0].code_government;

      const nameGovernment = await extractNameGovernment(uasg).then((data) => {
        return data;
      });

      data[i].government[0].name = nameGovernment.replace(/\n/g, "").trim();
    }
    console.log("finalizou", "dados orgao");
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
        const items = await extractItemsBidding(uasg, pregao, t).then(
          (data) => {
            item.push(...data.items);
            return item;
          }
        );

        data[i].reference_term.itens = { items }; //items;
      }
    }
    console.log("finalizou", "itens");
    res
      .status(StatusCodes.OK)
      .json({ data, total_biddings: total, total_pages: totalPage });
  } catch (error) {
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

    const items = [];
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
        unitary_value: 0,
        value_reference: 0,
        winner: "false",
        item_balance: 0,
      };

      items.push(item);
    });

    return { items, totalItems, totalPages };
  } catch (error) {
    console.error("Error", error.message);
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

`hcaptchaHabilitado: true
  hcaptchaSiteKey:"b8bbded1-9d04-4ace-9952-b67cde081a7b"
  recaptchaHabilitado: false
  recaptchaSiteKey: "6LeFY7UUAAAAANq3IRQtuH9hQFugmh_OR9OlQHaW"
  https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/v1/captcha/configuracao`;

// function buildUrl(text) {
//   return (
//     "http://comprasnet.gov.br/livre/Pregao/" +
//     text.substring(13, 47).replace(/["']/, "").trim()
//   );
// }

// function extractData(html) {
//   const $ = chr.load(html);
//   const warnings = [];

//   $("body").each((i, item) => {
//     warnings.push({
//       key: i + 1,
//       title: $(item)
//         .children(".tex3b")
//         .text()
//         .replace(/[0-9\t,;:"(\r\n|\n|\r)|//|]/g, "")
//         .trim(),
//       date: $(".mensagem2").text().trim(),
//       msg: $(item)
//         .children(".tex3")
//         .text()
//         .replace(/[\t:";(|\n|)|\ufffd|]/, "")
//         .trim(),
//     });
//   });

//   return warnings;
// }

// const Comprasnet = {
//   getWarnings: async (req, res) => {
//     try {
//       const urls = await getUrlsWarning(await getUrlMain());
//       const dataSetUrls = [];
//       const warnings = [];

//       for (const text of urls) {
//         const url = buildUrl(text);
//         dataSetUrls.push(url);
//       }

//       const htmlResponses = await Promise.all(
//         dataSetUrls.map((url) => axios.get(url))
//       );

//       for (const html of htmlResponses) {
//         const data = extractData(html.data);
//         warnings.push(data.flatMap((item) => item));
//       }

//       res.send(warnings.flatMap((item) => item));
//     } catch (error) {
//       res.status(500).send({ error: error.message });
//     }
//   },
//   loginComprasnet: async (req, res) => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     // await page.goto("https://www.gov.br/pt-br");
//     await page.goto(
//       "https://www.bec.sp.gov.br/fornecedor_ui/LoginFornecedor.aspx?chave="
//     );

//     // await Promise.all([
//     //   page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
//     //   page.evaluate(() => {
//     //     document
//     //       .querySelector("#barra-sso")
//     //       .shadowRoot.querySelector("#sso-status-bar")
//     //       .querySelector(".status-indicator")
//     //       .querySelector(".signed-out")
//     //       .click();

//     //   }),
//     // ]);

//     // await page.type("#accountId", "040.529.815-37", { delay: 100 }),
//     // await page.click('button[name="action"]'),
//     // await page.type("#password", "Fa281084@", { delay: 200 }),
//     // await page.click('button[value="enterPassword"]', { delay: 100 });

//     await page.type("#TextLogin", "15135292000147", { delay: 100 });
//     await page.type("#TextSenha", "ERCOM2019", { delay: 100 });
//     const chk = await page.waitForSelector("#chkAceite");
//     await chk.click();
//     await page.click("#Btn_Confirmar", { delay: 100 });
//     //const btn = await page.waitForSelector("#aspnetForm");

//     //await page.waitForSelector('iframe[src="https://newassets.hcaptcha.com/captcha/v1/7d69057/static/hcaptcha.html#frame=checkbox&id=04yljyqmjz9&host=sso.acesso.gov.br&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=off&custom=false&hl=pt-BR&tplinks=on&sitekey=93b08d40-d46c-400a-ba07-6f91cda815b9&theme=light&origin=https%3A%2F%2Fsso.acesso.gov.br&size=invisible"]')
//     // await page.solveRecaptchas()

//     // const url = await page.evaluate(async () => {
//     //   return document.location.href;
//     // });

//     const url = await Promise.all([
//       page.waitForNavigation({
//         waitUntil: ["load", "networkidle2"],
//         timeout: 500000,
//       }),
//       page.waitForSelector("#form1"),
//     ]);

//     const uri = await page.evaluate(() => {
//       let uri = document.location.href;
//       return uri;
//     });
//     // console.log(uri);
//     // url[3].call();
//     //const cookies = await page.cookies();
//     await browser.close();
//     // const ck = JSON.stringify(cookies[0].value)
//     // console.log(cookies);
//     // await page.close();

//     //   const response = await page.cookies();
//     //  // page.waitForRequest((request) => console.log(request.url()));
//     //   const cookie = []
//     //  await page.cookies.forEach(async(ck) =>{
//     //     cookie.push(ck.value)

//     //  })
//     // console.log( page.cookies);
//     // console.log(cookies.value);
//     //aspnetForm
//     // console.log(url);
//     // await Promise.all([
//     //   page.waitForNavigation(),
//     //   page.waitForSelector('div[class="button-submit button"]', {timeout: 150000}),
//     //   //  page.click('.button')
//     // ])
//     // await page.screenshot({ path: 'response.png', fullPage: true })

//     // await page.goto(config.pageUrl);
//     //await Promise.all([page.waitForNavigation(),page.click('#h-captcha-response-0k1a0adf3bo')]);
//     //await page.screenshot({ path: 'response.png', fullPage: true })
//     //id=h-captcha-response-0k1a0adf3bo

//     res.send({ url: uri });
//   },
// };

// async function recaptchacompat(apikey) {
//   const formData = {
//     form: {
//       method: "userrecaptcha",
//       googlekey: config.sitekey,
//       key: apikey,
//       pageurl: config.pageUrl,
//       json: 1,
//     },
//   };
//   const response = await axios.default.post(config.apiSubmitUrl, formData);
//   const idcaptcha = response.data;
//   console.log(idcaptcha);
//   return idcaptcha;
// }

module.exports = { getDataBiddings, getItemsBiddings };
//SITE KEY
//93b08d40-d46c-400a-ba07-6f91cda815b9
//93b08d40-d46c-400a-ba07-6f91cda815b9
//https://newassets.hcaptcha.com/captcha/v1/7d69057/static/hcaptcha.html#frame=checkbox&id=04yljyqmjz9&host=sso.acesso.gov.br&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=off&custom=false&hl=pt-BR&tplinks=on&sitekey=93b08d40-d46c-400a-ba07-6f91cda815b9&theme=light&origin=https%3A%2F%2Fsso.acesso.gov.br&size=invisible
