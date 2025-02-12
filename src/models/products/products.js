const modelProduct = require("../products/schemaProducts");

/**
 * @typedef {import("../../types/products").Products} Products
 */

class Product {
  constructor() {
    this.model = modelProduct;
  }
  /**
   * Cria um novo produto no banco de dados.
   * @param {Products} data - Os dados do produto a serem criados.
   * @returns {Promise} O produto salvo no banco de dados.
   */
  async create(data) {
    console.log(data);
    if (!data) return null;
    const product = new this.model(data);
    return product.save();
  }

  async find() {
    const products = await this.model.find();
    // console.log(products);
    return products;
  }

  /**
   * @param {string} id
   */
  async findById(id) {
    const items = await this.model.findById(id);
    return items;
  }

  /**
   * @param {string} id
   * @param {import("mongoose").UpdateQuery<{ createdAt: NativeDate; updatedAt: NativeDate; } & { _id?: import("mongoose").Types.ObjectId | undefined;
   *  sku?: string | undefined;
   *  description?: string | undefined;
   *  unit?: string | undefined;
   *  price?: import("mongoose").Types.Decimal128 | undefined;
   *  category?: string | undefined;
   *  brand?: string | undefined;
   *  stock?: number | undefined;
   *  image?: string | undefined;
   *  active?: boolean | undefined;
   *  model?: string | undefined; }> | undefined} data
   */
  async update(id, data) {
    //console.log(data);
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}
module.exports = Product;
