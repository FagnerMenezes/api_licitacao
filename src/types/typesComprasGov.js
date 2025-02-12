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
 * @typedef {Object} ChaveCompra
 * @property {number} idUasgIdentificacao
 * @property {number} idModalidade
 * @property {number} numero
 * @property {number} ano
 * @property {number} numeroUasg
 */

/**
 * @typedef {Object} Mensage
 * @property {ChaveCompra} chaveCompra
 * @property {string} chaveMensagemNaOrigem
 * @property {string} texto
 * @property {string} categoria
 * @property {string} dataHora
 * @property {string} tipoRemetente
 * @property {string}  identificadorDestinatario
 * @property {string}  identificadorRemetente
 */

/**
 * @typedef {Mensage[]} DataMsg
 */

/**
 * @typedef {Data} DataArray
 */
