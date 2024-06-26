/**
 * @typedef {Object} DataItem
 * @property {string} marcaFabricante - A marca ou fabricante do item.
 * @property {string} modeloVersao - O modelo ou versão do item.
 * @property {boolean} modificado - Indica se o item foi modificado.
 * @property {number} propostaTrabalhoMre - Proposta de trabalho MRE.
 * @property {number} quantidadeOfertada - Quantidade ofertada do item.
 * @property {number} valor - Valor do item.
 */

/**
 * @typedef {Object} Item
 * @property {string} item - Identificador do item.
 * @property {DataItem} dataItem - Dados detalhados do item, {objeto json}.
 */

/**
 * @typedef {Object} ItensContainer
 * @property {number} totalItens - Número total de itens.
 * @property {Item[]} itens - Lista de itens.
 */

/**
 * @typedef {Object} Data
 * @property {string} codeLicitacao - Código da licitação.
 * @property {string} token - Token de autenticação.
 * @property {ItensContainer} [itensContainer] - Contêiner opcional de itens.
 */

/**
 * @typedef {Data} DataArray
 */