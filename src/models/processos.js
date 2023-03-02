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
  government: [
    {
      name: String,
      cnpj: String,
      code_government: String,
      manager: String,
      address: [
        {
          _id: String,
          zip_code: String,
          complement: String,
          street: String,
          number: String,
          district: String,
          city: String,
          type_address: {
            id: String,
            name: String,
          },
          uf: {
            id: String,
            name: String,
          },
        }
      ],
      contact: [
        {
          _id: String,
          name: String,
          sector: String,
          contact: String,
          tipo: {
            id: String,
            name: String,
          }
        }
      ]
    },
  ],
  note_commitment: [
    {
      _id: String,
      code_note: String,
      value_note: mongoose.Types.Decimal128,
      status_note: {
        _id: String,
        name: String
      }
    }
  ],
  notes: [
    {
      _id: String,
      comments: String,
      createdAt: Date
    }
  ],
  reference_term: {
    validity: String,
    guarantee: String,
    deadline: String,
    comments: String,
    itens: [
      {
        id:String,
        cod: String,
        lote: String,
        amount: Number,
        unit: String,
        description: String,
        brand: String,
        model: String,
        unitary_value: mongoose.SchemaTypes.Decimal128,
        value_reference: mongoose.SchemaTypes.Decimal128,
        winner: String,
        item_balance:Number
      }
    ]
  }
});

const Processos = mongoose.model("Processos", procesSchema);

module.exports = Processos;
