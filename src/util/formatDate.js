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
module.exports = {
  converterData,
};
