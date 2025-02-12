const ProductsModel = require("../models/products/products");

/**
 * Função auxiliar para lidar com a resposta da requisição
 * @param {import("express").Response} res
 * @param {Object} data
 * @param {number} statusCode
 */
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

/**
 * Função auxiliar para lidar com erros de requisição
 * @param {import("express").Response} res
 * @param {Error} error
 */
const handleError = (res, error) => {
  res.status(400).json({ message: error.message });
};

const ProductsController = {
  /**
   * Cria um novo produto
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  create: async (req, res) => {
    try {
      const newProduct = new ProductsModel();
      const response = await newProduct.create(req.body);
      sendResponse(res, response, 201);
    } catch (error) {
      handleError(res, error);
    }
  },

  /**
   * Busca todos os produtos
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  find: async (req, res) => {
    try {
      const products = new ProductsModel();
      const response = await products.find();
      //console.log(response);
      sendResponse(res, response);
    } catch (error) {
      handleError(res, error);
    }
  },

  /**
   * Busca um produto pelo ID
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  findById: async (req, res) => {
    try {
      const productById = new ProductsModel();
      const response = await productById.findById(req.params.id);
      sendResponse(res, response);
    } catch (error) {
      handleError(res, error);
    }
  },

  /**
   * Atualiza um produto
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  update: async (req, res) => {
    try {
      const productUpdated = new ProductsModel();
      const response = await productUpdated.update(req.params.id, req.body);
      sendResponse(res, response);
    } catch (error) {
      handleError(res, error);
    }
  },

  /**
   * Deleta um produto
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  delete: async (req, res) => {
    try {
      const products = new ProductsModel();
      await products.delete(req.params.id);
      res.status(204).end(); // Sem conteúdo a retornar
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = ProductsController;
