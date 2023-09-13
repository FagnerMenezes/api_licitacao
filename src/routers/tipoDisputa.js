const express = require('express')
const router = express.Router()
const tipoDisputaControle = require('../controller/tipoDisputa')

router.route('/').get( (req, res) => tipoDisputaControle.get(req , res))
router.route('/create').post( (req, res) => tipoDisputaControle.post(req , res))
router.route('/update/:id').put( (req, res) => tipoDisputaControle.put(req , res))
router.route('/:id').delete( (req, res) => tipoDisputaControle.delete(req , res))


module.exports =  router;