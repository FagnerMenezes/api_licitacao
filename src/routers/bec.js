const express = require('express')
const Router = express.Router()
const bec = require('../controller/becScraper')

Router.route('/chat/:oc').get( (req,res) => bec.getChat(req, res) )
Router.route('/itens/:oc').get( (req,res) => bec.getItems(req, res) )
Router.route('/links/:oc').get( (req,res) => bec.getLinks(req, res) )
Router.route('/dados/:oc').get( (req,res) => bec.getDataGoverment(req, res) )

module.exports = Router

