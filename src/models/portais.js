const mongoose = require('mongoose');
const db = require('./db')
const Schema = mongoose.Schema;


const schemaPortais = new mongoose.Schema({   
        _id: String,
        name: String   
}, {timestamps:true} )
const Portais = mongoose.model('portais',schemaPortais)

module.exports  = Portais;