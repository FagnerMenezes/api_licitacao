const axios = require("axios");
const { v4: ID } = require("uuid");

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

const urlComprasPublicas = (pagina, dataInicial, dataFinal) => {
  return `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?codigoModalidade=1&codigoRealizacao=1&codigoStatus=1&dataInicial=${dataInicial}&dataFinal=${dataFinal}&tipoData=2&pagina=${pagina}`;
};

//RETORNA A URL COM OS DETALHES DA LICITAÇÃO
const dataBiddingComprasPublicas = async (url) => {
  const urlBase =
    "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao";
  const response = await axios.default.get(urlBase + url);
  //console.log(response.data);
  return response.data;
};

//PEGA AS LICITAÇÕES NO PORTAL DE COMPRAS PUBLICAS
const fetchBiddingsPortalComprasPublicas = async (body, pagina) => {
  const { dataInicial, dataFinal } = body;
  const url = await urlComprasPublicas(pagina, dataInicial, dataFinal);
  //console.log(url);
  const response = await axios.default.get(url);

  return response.data;
};
/**
 *
 * @param {object} body
 * @param {string | any} pagina
 * @returns
 */
const dataSetPortalComprasPublicas = async (body, pagina) => {
  try {
    const { dt_inicio, dt_fim } = body;

    const dataBody = {
      dataInicial:
        String(dt_inicio).substring(6, 10) +
        "-" +
        String(dt_inicio).substring(3, 5) +
        "-" +
        String(dt_inicio).substring(0, 2) +
        "T03:00:00.000Z",
      dataFinal:
        String(dt_fim).substring(6, 10) +
        "-" +
        String(dt_fim).substring(3, 5) +
        "-" +
        String(dt_fim).substring(0, 2) +
        "T03:00:00.000",
    };

    //FAZ O FETCH PARA BUSCAR O TOTAL DE LICITAÇÕES
    const { pageCount } = await fetchBiddingsPortalComprasPublicas(dataBody, 1);

    const promises = [];
    //FAZ O LOOP PARA CARREGAR AS PROMISSES
    for (let i = 1; i <= pageCount; i++) {
      const data = fetchBiddingsPortalComprasPublicas(dataBody, i);
      promises.push(data);
    }
    //EXECUTA AS PROMISSES
    const result = await Promise.all(promises);
    //FAZ O LOOP PARA OBTER A PENAS AS LICITAÇÕES
    const dataBidding = result.map((item) => {
      return item.result;
    });

    //ORGANIZA OS DADOS EM UM UNICO ARRAY
    const data = dataBidding.flatMap((data) => data);
    const dataSet = data.map(async (item) => {
      // console.log(item?.urlReferencia);
      const dataBiddings = await dataBiddingComprasPublicas(
        item?.urlReferencia
      );
      //console.log(dataBiddings);
      const items_ = await filterItemsPortalComprasPublicas(
        item?.codigoLicitacao
      );
      const items = items_.map(createItem);
      const biddings = await createBidding(items, dataBiddings, items);
      return biddings;
    });
    const ds = await Promise.all(dataSet.map(async (data) => await data));
    //console.log('compras publicas:',ds.length)
    return ds;
  } catch (error) {
    console.log(error, "dataSetPortalComprasPublicas");
  }
};

const createItem = (item) => {
  return {
    _id: ID(),
    cod: item?.codigo,
    lote: "",
    amount: item?.quantidade,
    unit: item?.unidade,
    description: item?.descricao,
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
};

const createBidding = async (item, dataBiddings, items) => {
  try {
    const dataAbertura = dataBiddings.dataHoraFinalRecebimentoPropostas;
    return {
      _id: ID(),
      process_data: {
        status: "Cadastrar proposta",
        type_dispute: "Menor preço unitário",
        modality: dataBiddings.codigoModalidade === 1 ? "PE" : "DL",
        portal: "COMPRAS PUBLICAS",
        n_process: item.numero,
        bidding_notice: item.identificacao,
        date_finish: String(dataAbertura).split("T")[0],
        object: dataBiddings.resumo,
        hours_finish: String(
          dataBiddings.dataHoraFinalRecebimentoPropostas
        ).substring(11, 16),
        date_init: String(
          dataBiddings.dataHoraInicioRecebimentoPropostas
        ).split("T")[0],
      },
      government: [
        {
          _id: ID(),
          cnpj: "0",
          name: dataBiddings.razaoSocialComprador,
          code_government: String(dataBiddings.codigoLicitacao),
          manager: true,
          address: [
            {
              _id: ID(),
              zip_code: "",
              complement: "",
              street: "",
              number: "",
              district: "",
              city: item.unidadeCompradora?.cidade,
              type_address: "COMPRAS",
              uf: item.unidadeCompradora?.uf,
            },
          ],
          contact: [
            {
              _id: ID(),
              name: dataBiddings.nomeAutoridadeCompetent,
              sector: "LICITAÇÃO",
              contact: "",
              tipo: "TEL",
            },
          ],
        },
      ],
      reference_term: {
        validity: "",
        guarantee: "",
        deadline: "",
        itens: items.filter((item) =>
          keywords.some((key) => item.description.includes(key))
        ),
      },
      linkEdital: await getLinkEdital(
        `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${dataBiddings.codigoLicitacao}/documentos/processo`
      ),
    };
  } catch (error) {
    console.log(error, "createBidding ");
  }
};

const urlItems = (pagina, codeBidding) => {
  return `https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/${codeBidding}/itens?filtro=&pagina=${pagina}`;
};
const filterItemsPortalComprasPublicas = async (codeBidding) => {
  try {
    const response = await axios.default.get(urlItems(1, codeBidding));
    let isLote = response.data.isLote;
    const totalPages = isLote
      ? response.data.lotes.pageCount
      : response.data.itens.pageCount;
    const itemsResponse = [];
    for (let i = 1; i <= parseInt(totalPages); i++) {
      const response = await axios.default.get(urlItems(i, codeBidding));
      itemsResponse.push(response);
    }
    const items = itemsResponse.map((item) => {
      let isLote = item.data.isLote;

      return !isLote ? item.data.itens.result : item.data.lotes.result[0].itens;
    });
    const itemArr = items.flatMap((item) => item);
    itemArr.flatMap((item, i) => {
      return item;
    });
    return itemArr;
  } catch (error) {
    console.log(error, "filterItemsPortalComprasPublicas");
    return error;
  }
};

const getLinkEdital = async (url) => {
  const response = await axios.default.get(url);
  //console.log(response.data);
  return response.data;
};

module.exports = { dataSetPortalComprasPublicas };
