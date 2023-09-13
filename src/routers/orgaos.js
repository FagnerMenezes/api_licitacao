const  express = require('express');
const OrgaoController = require('../controller/orgaos');
const router = express.Router();


//Órgão
router.get('/',OrgaoController.fyndAll);
router.get('/:id',OrgaoController.fyndByIdOrgao);
router.post('/create',OrgaoController.post);
router.put('/update/:id',OrgaoController.put);
router.delete('/delete/:id',OrgaoController.delete);
//Endereço
router.post('/:orgId/endereco/create',OrgaoController.postEnd);
router.put('/:orgId/endereco/update/:endId',OrgaoController.putEnd);
router.delete('/orgaos/:orgId/endereco/delete/:endId',OrgaoController.deleteEnd);
//Contato
router.post('/:org_id/contato/create',OrgaoController.postCotact);
router.put('/:org_id/contato/update',OrgaoController.putContact);
router.delete('/:org_id/contato/delete/:contact_id',OrgaoController.deleteContact);


module.exports =  router;

