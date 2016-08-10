var express = require('express');
var login = require('../server_modules/students/login');
var aboutGroup = require('../server_modules/students/aboutGroup');
var information = require('../server_modules/students/information');

var router = express.Router();
router.use('/login', function (req, res) {
	var userData = {
		username : req.param('username'),
		password : req.param('password')
	};
	login.login(userData, req, res);
});

router.use('/getInfo', function (req, res){
	var username = req.param('username');
	information(username, req, res);
});

router.use('/cancelLogin', function (req, res){
	login.cancelLogin(req, res);
});

router.use('/getGoods', function (req, res){
	var username = req.param('username');
	aboutGroup.getGoods(req, res, username);
});

router.use('/getSays', function (req, res){
	var username = req.param('username');
	aboutGroup.getSays(req, res, username);
});

router.use('/getWatchs', function (req, res){
	var username = req.param('username');
	aboutGroup.getWatch(req, res, username);
});
module.exports = router;