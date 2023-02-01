const express = require('express');
const Router = express.Router();
const status_ = require('../controller/status')

Router.route('/').get( (req, res) => status_.get(req, res));
Router.route('/create').post( (req, res) => status_.post(req, res));
Router.route('/update/:id').put( (req, res) => status_.put(req, res));
Router.route('/:id').delete( (req, res) => status_.delete(req, res));

module.exports = Router;