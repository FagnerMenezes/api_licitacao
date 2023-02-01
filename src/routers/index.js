const  Express = require("express");
const Router = Express.Router();

Router.get('/', (req,res)=>{
    res.send({msg:'api rodando'})
});

module.exports = Router;