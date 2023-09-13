const mongoose = require('mongoose');

const schemaGovernment = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: String,
    cnpj: String,
    code_government: String,
    address: [{
        _id:String,
        type_address: {
            id:String,
            name:String
        },
        street: String,
        number: String,
        district: String,
        city: String,
        uf: {
            id:String,
            name:String
        },
        zip_code: String,
        complement: String,
        createdAt: Date,
        updatedAt: Date
    }],
    contact:[{
        _id:String,
        name:String,
        sector:String,
        tipo:{
            id:String,
            name:String
        },
        contact:String
    }]
})

const orgaos = mongoose.model('orgaos', schemaGovernment)

module.exports = orgaos;


   