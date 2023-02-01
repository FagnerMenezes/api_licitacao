const express  = require('express')
const router = express.Router()
const portalControle = require('../controller/portais')

router.route('/').get( (req,res) => portalControle.get(req,res))
router.route('/create').post( (req,res) => portalControle.post(req,res))
router.route('/update/:id').put( (req,res) => portalControle.put(req,res))
router.route('/:id').delete( (req,res) => portalControle.delete(req,res))

module.exports = router