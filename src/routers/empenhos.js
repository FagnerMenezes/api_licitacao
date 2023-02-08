const  Express = require("express");
const Router = Express.Router();
const EmpenhoController = require('../controller/empenhos');


Router.get('/',EmpenhoController.fyndAllEmpenho);
Router.get('/:id',EmpenhoController.fyndByIdEmpenho);
Router.post('/create',EmpenhoController.post);
Router.put('/update/:id',EmpenhoController.put);
Router.delete('/delete/:id',EmpenhoController.delete);

module.exports =  Router;