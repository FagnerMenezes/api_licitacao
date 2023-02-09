const mongoose = require("mongoose");

const db = require("./db");
const Schema = mongoose.Schema;

const schemaNote_Commitment = new mongoose.Schema(
  {
    _id: mongoose.SchemaTypes.ObjectId,
    process_id: mongoose.SchemaTypes.ObjectId,
    code_note: String,
    value_note: mongoose.Types.Decimal128,
    status_note: {
      _id: String,
      name: String,
    },
  },
  {
    timestamps: true,
  }
);
const Empenhos = mongoose.model("empenhos", schemaNote_Commitment);

module.exports = Empenhos;
