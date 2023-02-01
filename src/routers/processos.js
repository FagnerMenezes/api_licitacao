const  express = require("express");
const ProcessoController = require('../controller/processos');
const router = express.Router();

router.get('/',ProcessoController.findProcesso);
router.get('/:id',ProcessoController.fyndByIdProcesso);
router.post('/create',ProcessoController.post);
router.put('/update/:id',ProcessoController.patch);
router.delete('/delete/:id',ProcessoController.delete);

module.exports =  router;