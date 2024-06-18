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
    status: String,
    type_dispute: String,
    modality: String,
    portal: String,
    code_pncp: String,
    srp: String
  },
  government: [
    {
      _id: String,
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
          type_address: String,
          uf: String,
        },
      ],
      contact: [
        {
          _id: String,
          name: String,
          sector: String,
          contact: String,
          tipo: String,
        },
      ],
    },
  ],
  note_commitment: [
    {
      _id: String,
      code_note: String,
      value_note: mongoose.Types.Decimal128,
      status_note: String,
      attachment: String,
    },
  ],
  notes: [
    {
      _id: String,
      comments: String,
      createdAt: Date,
    },
  ],
  reference_term: {
    validity: String,
    guarantee: String,
    deadline: String,
    initial_data: String,
    comments: String,
    itens: [
      {
        _id: String,
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
        item_balance: Number,
        origination: String,
      },
    ],
  },
});

const Processos = mongoose.model("Processos", procesSchema);

module.exports = Processos;
