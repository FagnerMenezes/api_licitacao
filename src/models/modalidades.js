const mongoose = require('mongoose');
const db = require('./db')
const Schema = mongoose.Schema;


const schemaModalities = new mongoose.Schema({   
        _id: String,
        name: String   
      
})
const Modalidades = mongoose.model('modalities',schemaModalities)

module.exports  = Modalidades;