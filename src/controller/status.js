const Status_ = require('../models/status')

const status_ = {

    get: async (req,res) =>{
           try {
            const response = await Status_.find().then( (data) =>{
               ;
                return data;
            })
            
            res.status(200).json(response)
           } catch (error) {
                res.status(400).json({msg:error.message})
           }
    },
    post: async (req,res) =>{
        try {
         const response = await Status_.create(req.body).then( (data) =>{
             return data;
         })
         res.status(200).json(response)
        } catch (error) {
             res.status(400).json({msg:error})
        }
 },
 put: async (req,res) =>{
    try {
     const response = await Status_.updateOne({_id:req.params.id},req.body).then( (data) =>{
         return data;
     })
     res.status(200).json(response)
    } catch (error) {
         res.status(400).json({msg:error})
    }
},
delete: async (req,res) =>{
    try {
     const response = await Status_.deleteOne({_id:req.params.id}).then( (data) =>{
         return data;
     })
     res.status(200).json(response)
    } catch (error) {
         res.status(400).json({msg:error})
    }
},

}

module.exports = status_