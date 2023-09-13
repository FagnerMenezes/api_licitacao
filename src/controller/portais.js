const Portais = require("../models/portais");

const Portal = {
  get: async (req, res) => {
    try {
      const response = await Portais.find().then((data) => {
        return data;
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ msg: "recurso não encontrado." });
    }
  },

  post: async (req, res) => {
    try {
      const response = await Portais.create(req.body).then((result) => {
        return result;
      });
      res.status(201).json(response);
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  },

  put: async (req, res) => {
    try {
      const response = await Portais.updateOne(
        { _id: req.params.id },
        req.body
      ).then((result) => {
        return result;
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  },
  
  delete: async (req, res) => {
    try {
      const response = await Portais.deleteOne(
        { _id: req.params.id }
      ).then((result) => {
        return result;
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  },
};

module.exports = Portal;
