const mongoose = require('mongoose');
const db = require('./db')
const Schema = mongoose.Schema;

const schemaStatus = new mongoose.Schema({   
    _id: String,
    name: String   
}, {timestamps:true} )
const Status = mongoose.model('status',schemaStatus)

module.exports  = Status;