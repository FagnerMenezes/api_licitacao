const Modalidade = require('../models/modalidades')

const Modalidades ={

    get: async (req, res) =>{
       try {
        const response  = await Modalidade.find().then( (data)=>{
            return data;
        } )
        res.status(200).json(response)
       } catch (error) {
        res.status(404).json({msg:"recurso não encontrado."})
       }
    }
}

module.exports = Modalidades;