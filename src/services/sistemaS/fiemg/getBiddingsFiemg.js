const axios = require("axios");

const getBiddingsFiemg = async () => {
  let headersList = {
    Accept: "*/*",
    "User-Agent": "*/*",
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    dtoProcesso: {
      nAnoFinalizacao: 0,
      tmpTipoMuralProcesso: 0,
      nCdModulo: 0,
      nCdModalidadeFase: 0,
      nCdTipoModalidade: 0,
      tmpTipoMuralVisao: 0,
      nCdSituacao: 0,
      nCdTipoProcesso: 0,
      nCdEmpresa: 0,
      sNrProcesso: "",
      nCdProcesso: 0,
      sDsObjeto: "",
      sDtPeriodoDe: "",
      sDtPeriodoAte: "",
      sOrdenarPor: "TDTINICIAL",
      sOrdenarPorDirecao: "DESC",
      dtoPaginacao: {
        nPaginaDe: 1,
        nPaginaAte: 100,
      },
      dtoIdioma: { nCdIdioma: 1 },
    },
  });

  let urlFiemg =
    "https://compras.fiemg.com.br/portal/WebService/Servicos.asmx/PesquisarProcessosPorSituacoesAgrupadas";
  let urlFieb =
    "https://compras.fieb.org.br/portal/WebService/Servicos.asmx/PesquisarProcessos";
  let urlFirjan =
    "https://portaldecompras.firjan.com.br/portal/WebService/Servicos.asmx/PesquisarProcessos";
  let urlFiergs =
    "https://compras.sistemafiergs.org.br/portal/WebService/Servicos.asmx/PesquisarProcessosPorSituacoesAgrupadas";
  let urlFiep =
    "https://compras.sistemafiergs.org.br/portal/WebService/Servicos.asmx/PesquisarProcessoDetalhes";

  let reqOptions = {
    url: urlFiergs,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  let response = await axios.default
    .request(reqOptions)
    .then((res) => console.log(res.data.d[69]))
    .catch((error) => console.log(error.message));
  //console.log(response);
};
