//URL PARA PEGAR AS MENSAGENS
//http://comprasnet.gov.br/livre/Pregao/Mensagens_Sessao_Publica.asp?prgCod=1115273
//URL AVISOS
//http://comprasnet.gov.br/livre/Pregao/avisos1.asp?prgCod=1124550&Origem=Avisos&Tipo=A
//URL POST AVISOS
//http://comprasnet.gov.br/livre/Pregao/lista_pregao.asp
//URL CHAT
//http://comprasnet.gov.br/livre/Pregao/Mensagens_Sessao_Publica.asp?prgCod=1124550

//const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const axios = require("axios");
const chr = require("cheerio");

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

async function urlGetWarnings(prgCod) {
  return `http://comprasnet.gov.br/livre/Pregao/avisos1.asp?prgCod=${prgCod}&Origem=Avisos&Tipo=E`;
}

async function urlPostWarnings(co_uasg, numprp) {
  return `http://comprasnet.gov.br/livre/Pregao/lista_pregao.asp?Opc=0&txtlstUasg=&rdTpPregao=E&lstSrp=T&lstICMS=T&lstSituacao=5&lstTipoSuspensao=0&uf=&co_uasg=${co_uasg}&numprp=${numprp}&dt_entrega=&dt_abertura=`;
}

async function getPrgCode() {
  const dados = {
    pregao: "152023", //"372023", //req.params.numprpm,52023
    uasg: "985915", //"986563", //req.params.co_uasg927190
  };
  const prgCod = await axios.default
    .get(await urlPostWarnings(dados.uasg, dados.pregao))
    .then((html) => {
      const $ = chr.load(html.data);
      const result = $("a").attr("onclick");
      const prgCod_ = result.replace(/[a-z-'(),_;]/gim, "").trim();
      return prgCod_;
    })
    .catch((error) => {
      console.error(error.message);
    });
  return prgCod;
}

async function getUrlMain() {
  const url = await axios.default
    .get(
      `http://comprasnet.gov.br/livre/Pregao/avisos1.asp?prgCod=${await getPrgCode()}&Origem=Avisos&Tipo=E`
    )
    .then((html) => {
      const $ = chr.load(html.data);
      const result = $("#q20").attr("src");
      const response = "http://comprasnet.gov.br/livre/Pregao/" + result;
      return response.toString();
    })
    .catch((error) => {
      console.error(error.message);
      res.send("error: " + error);
    });
  return url;
}

async function getUrlsWarning(url) {
  //console.log(url)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url); //carregar o frame externamente
  const elementHandle = await page.$(".td"); //busca um elemento (table) que contenha a classe .td
  //percorrer as linhas da table
  // retornar todos a tag a que tenha atributo onclick
  const msg = await elementHandle.$eval("tr", (el) =>
    Array.from(el.getElementsByTagName("a")).map((e) =>
      e.getAttribute("onclick")
    )
  );
  return msg;
}

function buildUrl(text) {
  return (
    "http://comprasnet.gov.br/livre/Pregao/" +
    text.substring(13, 47).replace(/["']/, "").trim()
  );
}

function extractData(html) {
  const $ = chr.load(html);
  const warnings = [];

  $("body").each((i, item) => {
    warnings.push({
      key: i + 1,
      title: $(item)
        .children(".tex3b")
        .text()
        .replace(/[0-9\t,;:"(\r\n|\n|\r)|//|]/g, "")
        .trim(),
      date: $(".mensagem2").text().trim(),
      msg: $(item)
        .children(".tex3")
        .text()
        .replace(/[\t:";(|\n|)|\ufffd|]/, "")
        .trim(),
    });
  });

  return warnings;
}

const Comprasnet = {
  getWarnings: async (req, res) => {
    try {
      const urls = await getUrlsWarning(await getUrlMain());
      const dataSetUrls = [];
      const warnings = [];

      for (const text of urls) {
        const url = buildUrl(text);
        dataSetUrls.push(url);
      }

      const htmlResponses = await Promise.all(
        dataSetUrls.map((url) => axios.get(url))
      );

      for (const html of htmlResponses) {
        const data = extractData(html.data);
        warnings.push(data.flatMap((item) => item));
      }

      res.send(warnings.flatMap((item) => item));
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  loginComprasnet: async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // await page.goto("https://www.gov.br/pt-br");
    await page.goto(
      "https://www.bec.sp.gov.br/fornecedor_ui/LoginFornecedor.aspx?chave="
    );

    // await Promise.all([
    //   page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
    //   page.evaluate(() => {
    //     document
    //       .querySelector("#barra-sso")
    //       .shadowRoot.querySelector("#sso-status-bar")
    //       .querySelector(".status-indicator")
    //       .querySelector(".signed-out")
    //       .click();

    //   }),
    // ]);

    // await page.type("#accountId", "040.529.815-37", { delay: 100 }),
    // await page.click('button[name="action"]'),
    // await page.type("#password", "Fa281084@", { delay: 200 }),
    // await page.click('button[value="enterPassword"]', { delay: 100 });

    await page.type("#TextLogin", "15135292000147", { delay: 100 });
    await page.type("#TextSenha", "ERCOM2019", { delay: 100 });
    const chk = await page.waitForSelector("#chkAceite");
    await chk.click();
    await page.click("#Btn_Confirmar", { delay: 100 });
    //const btn = await page.waitForSelector("#aspnetForm");

    //await page.waitForSelector('iframe[src="https://newassets.hcaptcha.com/captcha/v1/7d69057/static/hcaptcha.html#frame=checkbox&id=04yljyqmjz9&host=sso.acesso.gov.br&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=off&custom=false&hl=pt-BR&tplinks=on&sitekey=93b08d40-d46c-400a-ba07-6f91cda815b9&theme=light&origin=https%3A%2F%2Fsso.acesso.gov.br&size=invisible"]')
    // await page.solveRecaptchas()

    // const url = await page.evaluate(async () => {
    //   return document.location.href;
    // });

    const url = await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
        timeout: 500000,
      }),
      page.waitForSelector("#form1"),
    ]);

    const uri = await page.evaluate(() => {
      let uri = document.location.href;
      return uri;
    });
    // console.log(uri);
    // url[3].call();
    //const cookies = await page.cookies();
    await browser.close();
    // const ck = JSON.stringify(cookies[0].value)
    // console.log(cookies);
    // await page.close();

    //   const response = await page.cookies();
    //  // page.waitForRequest((request) => console.log(request.url()));
    //   const cookie = []
    //  await page.cookies.forEach(async(ck) =>{
    //     cookie.push(ck.value)

    //  })
    // console.log( page.cookies);
    // console.log(cookies.value);
    //aspnetForm
    // console.log(url);
    // await Promise.all([
    //   page.waitForNavigation(),
    //   page.waitForSelector('div[class="button-submit button"]', {timeout: 150000}),
    //   //  page.click('.button')
    // ])
    // await page.screenshot({ path: 'response.png', fullPage: true })

    // await page.goto(config.pageUrl);
    //await Promise.all([page.waitForNavigation(),page.click('#h-captcha-response-0k1a0adf3bo')]);
    //await page.screenshot({ path: 'response.png', fullPage: true })
    //id=h-captcha-response-0k1a0adf3bo

    res.send({ url: uri });
  },
};

async function recaptchacompat(apikey) {
  const formData = {
    form: {
      method: "userrecaptcha",
      googlekey: config.sitekey,
      key: apikey,
      pageurl: config.pageUrl,
      json: 1,
    },
  };
  const response = await axios.default.post(config.apiSubmitUrl, formData);
  const idcaptcha = response.data;
  console.log(idcaptcha);
  return idcaptcha;
}

module.exports = Comprasnet;
//SITE KEY
//93b08d40-d46c-400a-ba07-6f91cda815b9
//93b08d40-d46c-400a-ba07-6f91cda815b9
//https://newassets.hcaptcha.com/captcha/v1/7d69057/static/hcaptcha.html#frame=checkbox&id=04yljyqmjz9&host=sso.acesso.gov.br&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=off&custom=false&hl=pt-BR&tplinks=on&sitekey=93b08d40-d46c-400a-ba07-6f91cda815b9&theme=light&origin=https%3A%2F%2Fsso.acesso.gov.br&size=invisible
