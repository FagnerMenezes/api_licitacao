const express = require('express')
const Router = express.Router()
const comprasnet= require('../controller/comprasnetScraping')

Router.route('/warnings').get( (req,res) => comprasnet.getWarnings(req, res) )
Router.route('/login').get( (req,res) => comprasnet.loginComprasnet(req, res) )
// Router.route('/links/:oc').get( (req,res) => bec.getLinks(req, res) )
// Router.route('/dados/:oc').get( (req,res) => bec.getDataGoverment(req, res) )

module.exports = Router