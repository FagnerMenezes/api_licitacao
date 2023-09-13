const axios = require("axios");
const cheerio = require("cheerio");
const { v4: ID } = require("uuid");
const GET_KEY_BEC = require("../models/bec");
//const path = require("url");
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwiYXVkIjpbImh0dHA6Ly9sb2NhbC5hcGkuZWZmZWN0aS5jb20uYnIiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwic3ViIjoxNjIzODUzNjUzMDI5LCJjb21wYW55Ijo1MjQsInByb2ZpbGVzIjpbMV19.GwOlJhO4010BlRP9yduRyLkgmNj-DiuHrYqveQHdtfs";
//const fileName = path.fileURLToPath(path.resolve(__dirname, ""));
//const { Cluster } = require("puppeteer-cluster");
//const puppeteer = require("puppeteer-extra");
//const BASE_URL = "https://www.bec.sp.gov.br/bec_pregao_UI";

async function getItemsBec(url, localHost) {
  const response = await axios.default.get(url).then((result) => result);
  const $ = cheerio.load(response.data);
  //const data = $("tbody tr");
  const data = $("tbody tr");
  const items = [];

  const colSelector = "td:nth-child(4)";
  data.each((i, el) => {
    const text = $(el).find($("[data-label=Item]")).text().trim();
    if (text === "Item") return;
    const codeItem = $(el).find(colSelector).text();
    const dt = {
      _id: ID(),
      cod: $(el).find($("[data-label=Item]")).text(),
      lote: $(el).find($("[data-label=Item]")).text(),
      amount: parseInt($(el).find($("[data-label=Qtde.]")).text()),
      unit: $(el)
        .find($("[data-label='Unidade de Fornecimento']"))
        .text()
        .trim(),
      description: $(el).find($(".descricao")).text(),
      brand: "",
      model: "",
      unitary_value: { $numberDecimal: 0 },
      value_reference: { $numberDecimal: 0 },
      winner: "false",
      item_balance: 0,
      link_description_item: `http://${localHost}:21052/bec/description-item/${codeItem}`,
    };
    items.push(dt);
  });
  return items;
}

// const getChaveBec = async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(
//     "https://www.bec.sp.gov.br/fornecedor_ui/LoginFornecedor.aspx?chave="
//   );

//   await page.type("#TextLogin", "15135292000147", { delay: 100 });
//   await page.type("#TextSenha", "ERCOM2019", { delay: 100 });
//   const chk = await page.waitForSelector("#chkAceite");
//   await chk.click();
//   await page.click("#Btn_Confirmar", { delay: 100 });
//   const url = await Promise.all([
//     page.waitForNavigation({
//       waitUntil: ["load", "networkidle2"],
//       timeout: 500000,
//     }),
//     page.waitForSelector("#form1"),
//   ]);

//   const uri = await page.evaluate(() => {
//     let uri = document.location.href;
//     return uri;
//   });
//   await browser.close();
//   return { url: uri };
// };

const Bec = {
  getChat: async (req, res) => {
    const oc = req.params.oc;
    const url = `https://www.bec.sp.gov.br/bec_pregao_UI/OC/Pregao_OC_Item.aspx?chave=&OC=${oc}`;
    await axios.default
      .get(url)
      .then((html) => {
        const dom = cheerio.load(html.data);
        const dataset = [];
        const codFor = dom("#ctl00_wucOcFicha_lbApelido1021107").text();
        if (dom(".chat").length > 0) {
          dom(".chat").each((i, link) => {
            dataset.push({
              key: i,
              data: link.children[0].children[0].children[0].data,
              de: link.children[0].children[2].children[0].data,
              para: link.children[0].children[4].children[0].data,
              msg: link.children[1].children[0].data,
            });
          });
        } else {
          dataset.push({ msg: "Não há mensagens" });
        }
        res.json({ chat: dataset, codFornecedor: codFor });
      })
      .catch((err) => {
        res.json({ msg: err.message });
      });
  },
  getDataGovernment: async (req, res) => {
    try {
      const oc = req.params.oc;
      const url = `https://www.bec.sp.gov.br/bec_pregao_UI/OC/Pregao_OC_Item.aspx?chave=&OC=${oc}`;
      // const chave = await getChaveBec();
      // if (chave.url.length > 0) {
      //  console.log(chave);
      //  url = `${chave.url}&OC=${oc}`;
      // }

      const n_uge = oc.substring(0, 6);
      const getUrl = await axios.default
        .get(url)
        .then((html) => {
          const dom = cheerio.load(html.data);
          const dataset = [];
          dom("a", "#topMenu").each((i, link) => {
            dataset.push({
              key: i,
              descricao: link.children[0].data,
              link: link.attribs.href,
            });
          });
          return dataset;
        })
        .catch((err) => console.log(err));

      const Links = await axios.default.get(url).then((html) => {
        const dom = cheerio.load(html.data);
        const dataset = [];
        dom("a", "#topMenu").each((i, link) => {
          dataset.push({
            key: i,
            text: link.children[0].data,
            url: link.attribs.href,
          });
        });
        return dataset;
      });
      const Items = await getItemsBec(url, req.hostname);
      const Info_Government = await axios.default
        .get(
          `https://www.bec.sp.gov.br/BECSP/UGE/UGEResultado.aspx?chave=&CdUge=${n_uge}`
        )
        .then((html) => {
          const dom = cheerio.load(html.data);
          const string_extract = dom(
            "#ContentPlaceHolder1_txtRetEndereco"
          ).val();
          const extract_state = dom(
            "#ContentPlaceHolder1_txtRetMunicipio"
          ).val();
          const cnpj = dom("#ContentPlaceHolder1_txtRetCNPJ").val();
          const nome = dom("#ContentPlaceHolder1_txtRetNome").val();
          const street = String(string_extract).substring(
            0,
            string_extract.indexOf(",")
          );
          const number = String(
            string_extract
              .substring(string_extract.indexOf(","))
              .replace(/[^0-9]/g, "")
          );
          const district = String(
            string_extract.substring(string_extract.indexOf(",") + 1)
          );
          const state = String(extract_state)
            .substring(extract_state.indexOf("-") + 1)
            .replace(/\s/g, "");
          const city = String(extract_state).substring(
            0,
            extract_state.indexOf("-")
          );
          const zip_code = dom("#ContentPlaceHolder1_txtRetCEP").val();
          const uge = dom("#ContentPlaceHolder1_txtRetUge").val();
          return {
            cnpj,
            nome,
            uge,
            street,
            city,
            zip_code,
            number,
            district,
            state,
          };
        });

      const responsible = await axios.default
        .get(getUrl[1].link)
        .then((html) => {
          const dataset = [];
          const $ = cheerio.load(html.data);
          $("tr", "#ctl00_conteudo_panelGrid").each((i, el) => {
            dataset.push({
              nome: $(el).children("[data-label='Nome']").text(),
              responsabilidade: $(el)
                .children('[data-label="Responsabilidade"]')
                .text(),
              email: $(el).children('[data-label="e-mail"]').text(),
            });
          });
          return dataset;
        });
      const dateDispute = await axios.default
        .get(getUrl[8].link)
        .then((html) => {
          const $ = cheerio.load(html.data);
          const data = $("tbody tr");
          // console.log(data);
          const colSelector = "tr:nth-child(5) ,td:nth-child(2)";
          let dt = "";
          data.each((i, el) => {
            dt = $(el).find(colSelector).text();
          });
          const date = String(dt).substring(19, 29);
          const year = String(date).substring(6, 10);
          const month = String(date).substring(3, 5);
          //console.log(month);
          const day = String(date).substring(0, 2);
          return {
            date: `${year}-${month}-${day}`,
            hours: dt.substring(30),
          };
        });

      await axios.default.get(getUrl[0].link).then((html) => {
        const dataset = [];
        const dom = cheerio.load(html.data);
        dom("span", ".legenda_text").each((i, el) => {
          if (
            el.attribs.id ===
            "ctl00_conteudo_Wuc_OC_Ficha2_txtTotalFornecedores"
          )
            return;
          dataset.push({
            key: i,
            dados: el.children[0].data
              .replace("\n", " ")
              .replace("SP\n", "SP - CEP :"),
          });
        });
        const nameContact = responsible
          .filter((data) => data.responsabilidade.includes("Pregoeiro"))
          .map((data) => data.nome);
        const sectorContact = responsible
          .filter((data) => data.responsabilidade.includes("Pregoeiro"))
          .map((data) => data.responsabilidade);
        const data = {
          process_data: {
            portal: "BEC",
            modality: "PE",
            bidding_notice: oc,
            object: dataset[3].dados,
            date_finish: dateDispute.date,
            date_init: new Date(),
            hours_finish: dateDispute.hours,
          },
          data_government: [
            {
              _id: ID(),
              cnpj: Info_Government.cnpj,
              name: Info_Government.nome,
              code_government: Info_Government.uge,
              manager: "true",
              address: [
                {
                  _id: ID(),
                  type_address: "LICITAÇÃO",
                  street: Info_Government.street,
                  number: Info_Government.number,
                  district: Info_Government.district,
                  city: Info_Government.city,
                  uf: Info_Government.state,
                  zip_code: Info_Government.zip_code,
                  complement: "",
                },
              ],
              contact: [
                {
                  _id: ID(),
                  tipo: "TEL",
                  name: nameContact[0],
                  sector: sectorContact[0],
                  contact: dataset[1].dados,
                },
              ],
            },
          ],
          reference_term: {
            validity: "",
            guarantee: "",
            deadline: "",
            itens: Items,
          },
          links: Links,
          Responsible: responsible,
        };

        res.status(200).json(data);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  getDescriptionItemBec: async (req, res) => {
    try {
      const codeItem = req.params.codeItem;

      //console.log(req.hostname);
      const urlSearchItem = `https://www.bec.sp.gov.br/BEC_Catalogo_ui/CatalogDetalheNovo.aspx?chave=&selo=0&cod_id=${codeItem}`;
      const html = await axios.default
        .get(urlSearchItem)
        .then((response) => response);
      const $ = cheerio.load(html.data);
      const descriptionItem = $(
        "#ContentPlaceHolder1_lbCaracteristicaCompleta"
      ).text();

      if (descriptionItem.length > 0) {
        res.status(200).send({ description: descriptionItem });
      } else {
        res.status(404).send({ msg: "Item não localizado" });
      }
    } catch (error) {
      res.status(500).send({ msg: "Internal server Error " });
    }
  },
  registerProposalBec: async (req, res) => {
    const url =
      "https://mdw.minha.effecti.com.br/api-integracao/v1/proposta/bec";
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
        //console.log(response.data);
        return res.status(200).json(response.data);
      })
      .catch((err) => {
        //console.log(err.statusMessage);
        return res.status(400).json(err.statusMessage);
      });
  },
  getChaveBec: async (req, res) => {
    const response = await GET_KEY_BEC()
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
    console.log(response);
  },
};
//https://mdw.minha.effecti.com.br/api-integracao/v1/proposta/status
module.exports = Bec;
