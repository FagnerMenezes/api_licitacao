const mongoose = require('mongoose');
const db = require('./db')
const Schema = mongoose.Schema;


const schemaTipoDisputa = new mongoose.Schema({   
        _id: String,
        name: String   
}, {timestamps:true} )
const TipoDisputa= mongoose.model('tipo_disputa',schemaTipoDisputa)

module.exports  = TipoDisputa;