var express = require('express');
var passport = require('passport');
var router = express.Router();
var libs = process.cwd() + '/libs/';
// var User = require(libs + 'model/user');
var User = require('heha-gateway-model')('user');

User.register(router, '/');
//replace original NODEAPI by NODE RESTFUL API with passport
module.exports = router;