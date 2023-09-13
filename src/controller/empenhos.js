const { ObjectId } = require('mongodb');
const { Promise } = require('mongoose');
const Empenhos = require('../models/empenhos');
const Empenho = require('../models/empenhos');
const Processo = require('../models/processos')

exports.fyndAllEmpenho = async (req, res) => {
    try {
        const empenhos = await Empenho.find().then((result) => {
            return result
        }).catch((err) => {
            res.status(400).send(err)
        });
        await res.status(200).json(empenhos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.fyndByIdEmpenho = async (req, res) => {
    try {
        const empenhos = await Empenho.findById({
            _id: req.params.id
        }).then((result) => {
            return result;
        }).catch((err) => res.status(400).send(err));
        await res.status(200).json(empenhos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.post = async (req, res) => {
    try {
        const empenhos = await Empenho.insertMany(req.body).then((dados) => {
            return dados
        }).catch((err) => {
            res.status(400).send(err)
        })      
          const  bodyEmpenho ={
            "government_id": ObjectId(empenhos.government_id),
            "code_note": empenhos.code_note,
            "value_note": empenhos.value_note
            }
        const query = {
            _id: ObjectId(empenhos.process_id)
        };
        const updateDocument = {
            $push: {
                "note_commitment": bodyEmpenho
            }
        };
        const processo = await Processo.updateOne(query, updateDocument)
        await res.status(201).json(empenhos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}

exports.put = async (req, res) => {

    try {
     
        const empenhos = await Empenho.updateOne({
            _id: req.params.id
        }, req.body).then((dados) => {
            return dados
        }).catch((err) => {
            res.status(400).send(err)
        })
    //     const updateEmpenhos = await Empenho.findById({
    //         _id: req.params.id
    //     }, req.body).then((dados) => {
    //         return dados
    //     }).catch((err) => {
    //         res.status(400).send(err)
    //     })
    //     const  body_Empenho_Process ={
    //         "government_id":ObjectId(updateEmpenhos.government_id),
    //         "code_note": updateEmpenhos.code_note,
    //         "value_note": updateEmpenhos.value_note
    //         }
    //     const query = {
    //         _id: ObjectId(updateEmpenhos.process_id)
    //     };
    //     const updateDocument = {
    //         $set: {
    //             "note_commitment": body_Empenho_Process
    //         }
    //    // };
      //  const processo = await Processo.updateOne(query, updateDocument)
        await res.status(200).json(empenhos);
    } catch (error) {
       // console.log(error)
        res.status(404).json({
            msg: error
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const empenhos = await Empenho.deleteOne({
            _id: req.params.id
        }).then((dados) => {
            return dados
        }).catch((err) => {
            res.status(400).send(err)
        })
        await res.status(200).json(empenhos);
    } catch (error) {
        res.status(404).json({
            msg: error
        });
    }
}