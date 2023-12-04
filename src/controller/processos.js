const { ObjectId } = require("mongodb");
// const Processos = require('../models/processos');
const Processo = require("../models/processos");

exports.findProcesso = async (req, res) => {
  try {
    var pageNumber = Number(req.query.skip);
    var limite = Number(req.query.limit);
    var start = req.query.start;
    var end = req.query.end;
    // console.log(limite)
    if (limite === NaN || undefined) {
      limite = 1;
    }
    if (pageNumber === NaN || undefined) {
      pageNumber = 0;
    }
    // console.log(limite + ' - ' +pageNumber)
    if (start === undefined || end === undefined) {
      var data = new Date();
      var data_inicial = Number(data.getMonth());
      start = new Date(
        data.getFullYear(),
        data_inicial - data_inicial,
        data.getDate()
      )
        .toISOString()
        .split("T")[0];
      end = new Date(Date.now()).toISOString().split("T")[0];
    }
    const response = await Processo.aggregate([
      {
        $match: {
          $or: [
            {
              "process_data.n_process": req.query.processo,
            },
            {
              "process_data.bidding_notice": req.query.edital,
            },
            {
              "process_data.portal": req.params.portal,
            },
            {
              "government.name": req.params.orgao,
            },
            {
              "process_data.status": req.params.status,
            },
            {
              "government.cnpj": req.params.cnpj,
            },
            {
              "process_data.date_finish": {
                $gte: new Date(`${start}`),
                $lte: new Date(`${end}`),
              },
            },
          ],
        },
      },
    ])
      .skip(pageNumber)
      .limit(limite)
      .then((dados) => {
        return dados;
      })
      .catch((err) => {
        return err;
      });
    const totalProcessos = await Processo.find().count();
    // console.log(totalProcessos)
    res.status(200).json({
      process: response,
      total: totalProcessos,
    });
  } catch (error) {
    res.status(200).json({
      msg: error,
    });
  }
};

exports.fyndByIdProcesso = async (req, res) => {
  try {
    const Processos = await Processo.find({
      _id: ObjectId(req.params.id),
    }).then((result) => {
      return result;
    });
    await res.status(200).json({
      process: Processos,
    });
  } catch (error) {
    res.status(404).json({
      msg: error,
    });
  }
};

exports.post = async (req, res) => {
  // console.log(req.body.reference_term.itens);
  try {
    const Processos = await Processo.create(req.body)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
    await res.status(201).json(Processos);
  } catch (error) {
    res.status(404).json({
      msg: error,
    });
  }
};

exports.patch = async (req, res) => {
  try {
    Processo.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      req.body
    )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
    //await res.status(200).json(Processos);
  } catch (error) {
    res.status(404).json({
      msg: error,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const Processos = await Processo.deleteOne({
      _id: ObjectId(req.params.id),
    }).then((result) => {
      return result;
    });
    await res.status(200).json(Processos);
  } catch (error) {
    res.status(404).json(error);
  }
};
