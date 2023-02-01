const Tipo_disputa = require('../models/tipoDisputa')

const TipoDisputa ={

    get: async (req, res) =>{
       try {
        const response  = await Tipo_disputa.find().then( (data)=>{
            return data;
        } )
        res.status(200).json(response)
       } catch (error) {
        res.status(404).json({msg:"recurso não encontrado."})
       }
    },
    post: async (req, res) =>{
        try {
         const response  = await Tipo_disputa.create(req.body).then( (data)=>{
             return data;
         } )
         res.status(200).json(response)
        } catch (error) {
         res.status(404).json({msg:"recurso não encontrado."})
        }
     },
     put: async (req, res) =>{
        try {
         const response  = await Tipo_disputa.updateOne({_id:req.params.id},req.body).then( (data)=>{
             return data;
         } )
         res.status(200).json(response)
        } catch (error) {
         res.status(404).json({msg:"recurso não encontrado."})
        }
     },
     delete: async (req, res) =>{
        try {
         const response  = await Tipo_disputa.deleteOne({_id:req.params.id}).then( (data)=>{
             return data;
         } )
         res.status(200).json(response)
        } catch (error) {
         res.status(404).json({msg:"recurso não encontrado."})
        }
     }
}

module.exports = TipoDisputa;