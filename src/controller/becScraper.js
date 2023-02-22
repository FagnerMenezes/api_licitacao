const axios = require("axios");
const chr = require("cheerio");

async function url(oc) {
  return `https://www.bec.sp.gov.br/bec_pregao_UI/OC/Pregao_OC_Item.aspx?chave=&OC=${oc}`;
}

const Bec = {
  getChat: async (req, res) => {
    const oc = req.params.oc;
    await axios.default
      .get(await url(oc))
      .then((html) => {
        const dom = chr.load(html.data);
        const dataset = [];
        dom(".chat").each((i, link) => {
          dataset.push({
            key: i,
            data: link.children[0].children[0].children[0].data,
            de: link.children[0].children[2].children[0].data,
            para: link.children[0].children[4].children[0].data,
            msg: link.children[1].children[0].data,
          });
          //console.log(dataset);
        });
        // console.log('teste')
        res.status(200).json({ chat: dataset });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  getItems: async (req, res) => {
    const oc = req.params.oc;
    const dataset = [];
    await axios.default
      .get(await url(oc))
      .then((html) => {
        const $ = chr.load(html.data);

        // $("tr").each((i, el) => {
        //  // console.log($(el).children(".descricao").text())
        //   dataset.push({
        //     descricao: $(el).children(".descricao").text(),
        //     qtde: $(el).children('[data-label="Qtde."]').text(),
        //     unidade: $(el).children('[data-label="Unidade de Fornecimento"]').text(),
        //   });
        // });
        const keys = [
          "vazio",
          "Item",
          "Código",
          "Descrição",
          "Qtde.",
          "Unidade de fornecimento",
          "Melhor oferta",
          "Origem",
          "Apelido licitante",
          "Habilitação licitante",
          "Licitante",
        ];

        $("tr", "#ctl00_conteudo_dg").each((parentIndex, parentElem) => {
          let keyIndex = 0;
          const coinDetails = {};
          $(parentElem)
            .children()
            .each((childId, childElem) => {
              const value = $(childElem).text();
              if (value) {
                coinDetails[keys[keyIndex]] = value;
                keyIndex++;
              }
            });
          dataset.push(coinDetails);
        });
        res.status(200).json({ itens: dataset });
      })
      .catch((err) => {
        res.status(200).json({ msg: err.message });
      });
  },
  getLinks: async (req, res) => {
    const oc = req.params.oc;

    await axios.default
      .get(await url(oc))
      .then((html) => {
        const dom = chr.load(html.data);
        const dataset = [];
        dom("a", "#topMenu").each((i, link) => {
          dataset.push({
            key: i,
            descricao: link.children[0].data,
            link: link.attribs.href,
          });
        });
        res.status(200).json(dataset);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: err.message });
      });
  },

  getDataGoverment: async (req, res) => {
    let oc = req.params.oc;
    const n_uge = oc.substring(0, 6)

    const getUrl = await axios.default.get(await url(oc)).then((html) => {
      const dom = chr.load(html.data);
      const dataset = [];
      dom("a", "#topMenu").each((i, link) => {
        dataset.push({
          key: i,
          descricao: link.children[0].data,
          link: link.attribs.href,
        });
      });
      // console.log(dataset);
      return dataset;
    });

    const Links = await axios.default.get(await url(oc)).then((html) => {
      const dom = chr.load(html.data);
      const dataset = [];
      dom("a", "#topMenu").each((i, link) => {
        dataset.push({
          key: i,
          name: link.children[0].data,
          link: link.attribs.href,
        });
      });
      return dataset;
    });

    const Itens = await axios.default.get(await url(oc)).then((html) => {
      const $ = chr.load(html.data);
      const dataset = [];
      const keys = [
        "vazio",
        "Item",
        "Código",
        "Descrição",
        "Qtde.",
        "Unidade de fornecimento",
        "Melhor oferta",
        "Origem",
        "Apelido licitante",
        "Habilitação licitante",
        "Licitante",
      ];

      $("tr", "#ctl00_conteudo_dg").each((parentIndex, parentElem) => {
        let keyIndex = 0;
        const coinDetails = {};
        $(parentElem)
          .children()
          .each((childId, childElem) => {
            const value = $(childElem).text();
            if (value) {
              coinDetails[keys[keyIndex]] = value;
              keyIndex++;
            }
          });
        dataset.push(coinDetails);
      });
      return dataset;
    });

    const Cnpj = await axios.default
      .get(
        `https://www.bec.sp.gov.br/BECSP/UGE/UGEResultado.aspx?chave=&CdUge=${n_uge}`
      )
      .then((html) => {
        const dom = chr.load(html.data);
        const cnpj = dom("#ContentPlaceHolder1_txtRetCNPJ").val();
        const nome = dom("#ContentPlaceHolder1_txtRetNome").val();
        const uge = dom("#ContentPlaceHolder1_txtRetUge").val();
    
        return {cnpj,nome,uge};
      });

    const Responsaveis = await axios.default
      .get(getUrl[1].link)
      .then((html) => {
        const dataset = [];
        const $ = chr.load(html.data);
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

    const dados_gerais = axios.default.get(getUrl[0].link).then((html) => {
      const dataset = [];
      const dom = chr.load(html.data);
      dom("span", ".legenda_text").each((i, el) => {
        if (
          el.attribs.id === "ctl00_conteudo_Wuc_OC_Ficha2_txtTotalFornecedores"
        )
          return;
        dataset.push({
          key: i,
          dados: el.children[0].data
            .replace("\n", " ")
            .replace("SP\n", "SP - CEP :"),
        });
      });

      const dados = {
        dados_orgao: {
          cnpj: Cnpj.cnpj,
          orgao: Cnpj.nome,
          uge: Cnpj.uge,
          endereco_principal: dataset[0].dados,
          telefone: dataset[1].dados,
          endereco_entrega: dataset[2].dados,
          objeto: dataset[3].dados   
        },
        links: Links,
        itens: Itens,
        responsavei:Responsaveis
      };
      res.status(200).json({ data: dados });
    });
    
  },
};

module.exports = Bec;
