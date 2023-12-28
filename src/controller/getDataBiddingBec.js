const axios = require("axios");
const puppeteer = require("puppeteer-extra");
const cheerio = require("cheerio");
const { v4: ID } = require("uuid");

const getDataBiddingPortalBec = async (req, res) => {
  try {
    const data = [];
    const dataFilter = await getListNewBiddingsPortalBec();
    const processDataSet = async (typeBidding, processFunction) => {
      const filterDataSetBec = dataFilter.filter((item) =>
        item?.type_dispute?.includes(typeBidding)
      );

      let promises = filterDataSetBec.map(async (item) => {
        console.log("inicio", item.type_dispute);
        const dataItem = await processFunction(item.oc);
        console.log("fim", item.type_dispute);
        return dataItem;
      });

      let dataItem = await Promise.all(promises);
      dataItem.map((item) => {
        data.push(item);
      });

      // for (const item of filterDataSetBec) {
      //   //console.log("inicio", item.type_dispute);
      //   const dataItem = await processFunction(item.oc);
      //   data.push(dataItem);
      //  // console.log("fim", item.type_dispute);
      // }
    };
    await Promise.all([
      processDataSet("PE", getDataBiddingBec),
      processDataSet("CV", processDataSetInvitationPortalBec),
      processDataSet("DL", getDispensaDataFromTheBecPortal),
    ]);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getChaveBec = async () => {
  const response = await axios.default.get(
    "https://i5qjt36nld.execute-api.us-east-1.amazonaws.com/chavebec"
  );
  const url = response.data;
  return url;
};

//PEGA TODAS A LICITAÃ‡Ã•ES NOVAS NO PORTAL BEC
const getListNewBiddingsPortalBec = async () => {
  const url = await getChaveBec();
  const response = await axios.default.get(url).then((html) => html.data);
  const $ = cheerio.load(response);
  const tableRows = Array.from(
    $(".cssGridOCConsole > tbody tr").each((i, el) => el)
  );
  const dataSet = tableRows.map((row, i) => {
    if ($(row.children[6]).text().trim().includes("Oferta de Compra")) return;
    const typeDispute = String(
      $(row.children[7]).text().trim().substring(0, 7).trim()
    );
    const type_Dispute =
      typeDispute === "Convite"
        ? "CV"
        : typeDispute === "PregÃ£o"
        ? "PE"
        : "DL";

    const data = {
      oc: $(row.children[6]).text().trim(),
      type_dispute: type_Dispute,
      date_dispute: $(row.children[8]).text().trim().substring(0, 10),
      amountItems: $(row.children[10]).text().trim(),
    };
    return data;
  });
  const dateDay = new Date().getDate();
  const dateMoth = new Date().getMonth() + 1;
  const dataSetFilter = dataSet.filter(
    (item) =>
      parseInt(item?.date_dispute.substring(0, 2).trim()) >= dateDay &&
      parseInt(item?.date_dispute.substring(0, 2).trim()) <= dateDay + 1 &&
      parseInt(item?.date_dispute.substring(3, 5).trim()) === dateMoth
  );
  return dataSetFilter;
};

const getUrlInvitationPortalBec = async (oc) => {
  const urlAws =
    "https://8o3z8sxdh9.execute-api.us-east-1.amazonaws.com/urlconvite";
  const { data } = await axios.default.post(urlAws, {
    oc: oc,
  });
  const url = data.url;
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
  const linkItems = Links.filter((item) => item.text === "Convite");
  return linkItems[0].url;
};

//PEGA OS DADOS DO Ã“RGÃƒO NO PORTAL BEC
const getDataUgePortalBec = async (n_uge) => {
  const url = `https://www.bec.sp.gov.br/BECSP/UGE/UGEResultado.aspx?chave=&CdUge=${n_uge}`;
  const response = await axios.default.get(url).then((html) => html.data);
  const $ = cheerio.load(response);
  const data = {
    cnpj: $("#ContentPlaceHolder1_txtRetCNPJ").val(),
    nome_uge: $("#ContentPlaceHolder1_txtRetNome").val(),
    rua: $("#ContentPlaceHolder1_txtRetEndereco").val(),
    cidade: $("#ContentPlaceHolder1_txtRetMunicipio").val(),
    cep: $("#ContentPlaceHolder1_txtRetCEP").val(),
    email: $("#ContentPlaceHolder1_txtRetEMail").val(),
    tel: $("#ContentPlaceHolder1_txtRetPriTelefone")
      .val()
      .replace(/[^0-9]/gim, ""),
  };
  return data;
};

const getItemsInvitationBec = async (url) => {
  const response = await axios.default.get(url).then((html) => {
    const $ = cheerio.load(html.data);
    const items = [];
    const textDateInvitation = $(
      "#ctl00_DetalhesOfertaCompra1_txtPerCotEletronica"
    ).text();
    const dateFormate = textDateInvitation.substring(22, 32);
    //const year = dateFormate.substring(6,10);
    const dateFinish =
      dateFormate.substring(6, 10) +
      "-" +
      dateFormate.substring(3, 5) +
      "-" +
      dateFormate.substring(0, 2);

    const dates = {
      date_init: new Date().toISOString().split("T")[0],
      date_finish: dateFinish,
      hours_finish: textDateInvitation.substring(33, 38),
    };
    //ctl00_c_area_conteudo_wuc_OC_ITEM_LANCE_DISPENSA1_dtgItens
    const itens = $("tr", "#ctl00_c_area_conteudo_grdv_item > tbody").each(
      (i, el) => {
        const item = {
          _id: ID(),
          cod: $(el.children[2]).text().trim(),
          code: $(el.children[3]).text().trim(),
          amount: parseInt($(el.children[5]).text().trim()),
          unit: $(el.children[6]).text().trim(),
          description: $(el.children[4]).text().trim(),
          brand: "",
          model: "",
          unitary_value: { $numberDecimal: "0" },
          value_reference: { $numberDecimal: "0" },
          winner: "false",
          item_balance: 0,
        };

        items.push(item);
        //console.log(items);
        return item;
      }
    );

    const itemsFilter = items.filter((item) => item.code !== "CÃ³digo");
    return { items: itemsFilter, dates };
  });
  return response;
};

//PESQUISA RELACIONADA AO CONVITE NO PORTAL BEC COM NUMERO DA OC
const getInvitationDataFromTheBecPortal = async (oc) => {
  const url = await getUrlInvitationPortalBec(oc);
  const num_uge = String(oc).substring(0, 6);
  const dadaGovernmentBec = await getDataUgePortalBec(num_uge);
  const items = await getItemsInvitationBec(url);

  const dataBidingBec = {
    _id: ID(),
    process_data: {
      portal: "BEC",
      modality: "CV",
      bidding_notice: oc,
      object: "Materiais para solda ",
      date_finish: items.dates.date_finish,
      date_init: items.dates.date_finish,
      hours_finish: items.dates.hours_finish,
    },
    government: [
      {
        _id: ID(),
        cnpj: dadaGovernmentBec.cnpj,
        name: dadaGovernmentBec.nome_uge,
        code_government: num_uge,
        manager: "true",
        address: [
          {
            _id: ID(),
            type_address: "LICITACAO",
            street: dadaGovernmentBec?.rua, //txt.item(13).textContent.trim(),
            number: "s/n",
            district: "",
            city: dadaGovernmentBec?.cidade,
            uf: "SP",
            zip_code: dadaGovernmentBec?.cep,
            complement: "",
          },
        ],
        contact: [
          {
            _id: ID(),
            tipo: "TEL",
            name: "COMPRAS",
            sector: "LICITACAO",
            contact: dadaGovernmentBec?.tel,
          },
          {
            _id: ID(),
            tipo: "EMAIL",
            name: "COMPRAS",
            sector: "LICITACAO",
            contact: dadaGovernmentBec?.email,
          },
        ],
      },
    ],
    reference_term: {
      validity: "",
      guarantee: "",
      deadline: "",
      itens: items.items,
    },
  };
  // console.log(dataBidingBec);
  return dataBidingBec;
};

//OBTÃ‰M OS DADOS RELACIONADOS A CONVITE NO PORTAL BEC
const processDataSetInvitationPortalBec = async (oc) => {
  const dataBidding = await getInvitationDataFromTheBecPortal(oc);
  return dataBidding;
};

//OBTÃ‰M OS DADOS RELACIONADOS Ao PREGÃƒO NO PORTAL BEC
const getDataBiddingBec = async (oc) => {
  const url = `https://www.bec.sp.gov.br/bec_pregao_UI/OC/Pregao_OC_Item.aspx?chave=&OC=${oc}`;
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
  const Items = await getItemsBec(url, "");
  const Info_Government = await axios.default
    .get(
      `https://www.bec.sp.gov.br/BECSP/UGE/UGEResultado.aspx?chave=&CdUge=${n_uge}`
    )
    .then((html) => {
      const dom = cheerio.load(html.data);
      const string_extract = dom("#ContentPlaceHolder1_txtRetEndereco").val();
      const extract_state = dom("#ContentPlaceHolder1_txtRetMunicipio").val();
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

  const responsible = await axios.default.get(getUrl[1].link).then((html) => {
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
  const urlGetDateDispute =
    getUrl.length >= 9 ? getUrl[8].link : getUrl[6].link;
  const dateDispute = await axios.default
    .get(urlGetDateDispute)
    .then((html) => {
      const $ = cheerio.load(html.data);
      const data = $("tbody tr");
      //console.log(data);
      const colSelector = "tr:nth-child(5) ,td:nth-child(2)";
      let dt = "";
      data.each((i, el) => {
        dt = $(el).find(colSelector).text();
      });
      //console.log(dt);
      const date = String(dt).substring(19, 29);
      const year = String(date).substring(6, 10);
      const month = String(date).substring(3, 5);
      //console.log(month);
      const day = String(date).substring(0, 2);
      return {
        date: `${year}-${month}-${day}`,
        hours: dt.substring(30),
      };
    })
    .catch((err) => {
      return {
        date: `0000-00-0}`,
        hours: "00:00",
      };
    });

  const dataBidding = await axios.default.get(getUrl[0].link).then((html) => {
    const dataset = [];
    const dom = cheerio.load(html.data);
    dom("span", ".legenda_text").each((i, el) => {
      if (el.attribs.id === "ctl00_conteudo_Wuc_OC_Ficha2_txtTotalFornecedores")
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
      _id: ID(),
      process_data: {
        portal: "BEC",
        modality: "PE",
        bidding_notice: oc,
        object: dataset[3].dados,
        date_finish: dateDispute.date,
        date_init: dateDispute.date,
        hours_finish: dateDispute.hours,
      },
      government: [
        {
          _id: ID(),
          cnpj: Info_Government.cnpj,
          name: Info_Government.nome,
          code_government: Info_Government.uge,
          manager: "true",
          address: [
            {
              _id: ID(),
              type_address: "LICITAÃ‡ÃƒO",
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
    };
    //console.log("DADOS PREGÃƒO:", data);
    return data;
  });
  return dataBidding;
};

////OBTÃ‰M OS ITENS RELACIONADOS AO PREGÃƒO NO PORTAL BEC
async function getItemsBec(url, localHost) {
  const response = await axios.default.get(url).then((result) => result);
  const $ = cheerio.load(response.data);
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
      code: $(el).find($("[data-label=CÃ³digo]")).text(),
      lote: $(el).find($("[data-label=Item]")).text(),
      amount: parseInt($(el).find($("[data-label=Qtde.]")).text()),
      unit: $(el)
        .find($("[data-label='Unidade de Fornecimento']"))
        .text()
        .trim(),
      description: $(el).find($(".descricao")).text(),
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
    };
    //console.log(dt);
    items.push(dt);
  });
  return items;
}
//PEGA A URL PARA EXTRAIR OS DADOS DA DISPENSA DE LICITAÃ‡ÃƒO
const getUrlDispensanPortalBec = async (oc) => {
  try {
    const urlAws =
      "https://pnqlxrajy5.execute-api.us-east-1.amazonaws.com/geturldispensabec";
    const { data } = await axios.default.post(urlAws, {
      oc: oc,
    });
    const url = data.url;
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
    const [{ url: linkurl }] = Links.filter((item) =>
      item.text.includes("Dispensa")
    );
    // console.log(linkItems);
    console.log("https://www.bec.sp.gov.br/BEC_Dispensa_UI/ui/" + linkurl);
    return "https://www.bec.sp.gov.br/BEC_Dispensa_UI/ui/" + linkurl;
  } catch (error) {
    console.error(error);
    return error;
  }
};
//PESQUISA RELACIONADA AO CONVITE NO PORTAL BEC COM NUMERO DA OC
const getDispensaDataFromTheBecPortal = async (oc) => {
  const url = await getUrlDispensanPortalBec(oc);
  const num_uge = String(oc).substring(0, 6);
  const dadaGovernmentBec = await getDataUgePortalBec(num_uge);
  const items = await getItemsDispensaBec(url);
  const itemsFilter = items.items.filter((item) => item.code != "CÃ³digo");
  const dataBidingBec = {
    _id: ID(),
    process_data: {
      portal: "BEC",
      modality: "DL",
      bidding_notice: oc,
      object: "Materiais para solda ",
      date_finish: items.dates.date_finish,
      date_init: items.dates.date_finish,
      hours_finish: items.dates.hours_finish,
    },
    government: [
      {
        _id: ID(),
        cnpj: dadaGovernmentBec.cnpj,
        name: dadaGovernmentBec.nome_uge,
        code_government: num_uge,
        manager: "true",
        address: [
          {
            _id: ID(),
            type_address: "LICITACAO",
            street: dadaGovernmentBec?.rua, //txt.item(13).textContent.trim(),
            number: "s/n",
            district: "",
            city: dadaGovernmentBec?.cidade,
            uf: "SP",
            zip_code: dadaGovernmentBec?.cep,
            complement: "",
          },
        ],
        contact: [
          {
            _id: ID(),
            tipo: "TEL",
            name: "COMPRAS",
            sector: "LICITACAO",
            contact: dadaGovernmentBec?.tel,
          },
          {
            _id: ID(),
            tipo: "EMAIL",
            name: "COMPRAS",
            sector: "LICITACAO",
            contact: dadaGovernmentBec?.email,
          },
        ],
      },
    ],
    reference_term: {
      validity: "",
      guarantee: "",
      deadline: "",
      itens: itemsFilter,
    },
  };
  return dataBidingBec;
};

const getItemsDispensaBec = async (url) => {
  const response = await axios.default.get(url).then((html) => {
    const $ = cheerio.load(html.data);
    const items = [];
    const textDateDispensa = $(
      "#ctl00_DetalhesOfertaCompra1_txtPerCotEletronica"
    ).text();

    const dateFormate = textDateDispensa.substring(25, 35);

    const dateFinish =
      dateFormate.substring(6, 10) +
      "-" +
      dateFormate.substring(3, 5) +
      "-" +
      dateFormate.substring(0, 2);

    const dates = {
      date_init: new Date().toISOString().split("T")[0],
      date_finish: dateFinish,
      hours_finish: textDateDispensa.substring(39, 44),
    };
    //ctl00_c_area_conteudo_wuc_OC_ITEM_LANCE_DISPENSA1_dtgItens
    const itens = $(
      "tr",
      "#ctl00_c_area_conteudo_wuc_OC_ITEM_LANCE_DISPENSA1_dtgItens > tbody"
    ).each((i, el) => {
      const item = {
        _id: ID(),
        cod: $(el.children[1]).text().trim(),
        code: $(el.children[3]).text().trim(),
        amount: parseInt($(el.children[5]).text().trim()),
        unit: $(el.children[6]).text().trim(),
        description: $(el.children[4]).text().trim(),
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
      };

      items.push(item);
      //console.log(items);
      return item;
    });
    //items.push(itens);
    return { items, dates };
  });
  return response;
};
//getDataBiddingPortalBec();
module.exports = { getDataBiddingPortalBec };
