const { Long } = require("mongodb");
const mongoose = require("mongoose");
const db = require("./db");
const Schema = mongoose.Schema;

const procesSchema = new Schema({
  process_data: {
    n_process: String,
    bidding_notice: String, 
    date_finish: Date,
    object: String,
    hours_finish: String,
    createdAt: Date,
    updatedAt: Date,
    code_bidding: String,
    date_init: Date,
    status: {
      id: String,
      name: String,
    },
    type_dispute: {
      id: String,
      name: String,
    },
    modality: {
      id: String,
      name: String,
    },
    portal: {
      id: String,
      name: String,
    },
  },
  participating_bodies: [
    {
      government_id: mongoose.SchemaTypes.ObjectId,
    },
  ],
  government: {
    government_id: mongoose.SchemaTypes.ObjectId,
    name: String,
    cnpj: String,
  },
  note_commitment: [
    {
      government_id: mongoose.SchemaTypes.ObjectId,
      code_note: String,
      value_note: mongoose.SchemaTypes.Decimal128,
    },
  ],
  notes:[
    {
      _id:String,
      comments:String,
      createdAt:Date
    }
  ],
  reference_term:{
    itens:[
     {
      cod:String,
      lote:String,
      amount:Number,
      unit:String,
      description:String,
      brand:String,
      model:String,
      unitary_value:mongoose.SchemaTypes.Decimal128,
      unitary_value_reference:mongoose.SchemaTypes.Decimal128,
     }
    ]
  }
});

const Processos = mongoose.model("Processos", procesSchema);

module.exports = Processos
