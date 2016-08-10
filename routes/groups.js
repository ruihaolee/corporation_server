var express = require('express');

var register = require('../server_modules/corporation/register');
var groupLogin = require('../server_modules/corporation/login');
// var message = require('../server_modules/corporation/message');
var information = require('../server_modules/corporation/information');
var verificationCode = require('../server_modules/corporation/verificationCode');

var router = express.Router();
router.use('/register', function (req, res){
	var groupData = {
		groupName : req.param('groupName'),
		groupProfile : req.param('groupProfile'),
		groupLoginName : req.param('groupLoginName'),
		groupLoginPassword : req.param('groupLoginPassword'),
		headNumber : req.param('headNumber'),
		headPassWord : req.param('headPassWord'),
		headPhone : req.param('headPhone'),
		verCode : req.param('verCode') 		
	};
	register(req, res, groupData);
});

router.use('/verificationCode', function (req, res){
	verificationCode(req, res);
});

router.use('/login', function (req, res){
	var groupLoginData = {
		groupLoginName : req.param('groupLoginName'),
		groupLoginPassword : req.param('groupLoginPassword')
	};
 	groupLogin.login(req, res, groupLoginData);
});

router.use('/cancelLogin', function (req, res){
	groupLogin.cancelLogin(req, res);
});

router.use('/getInfo', function (req, res){
	var group_id = req.param('group_id');
	information.groupInfo(req, res, group_id);
});

router.use('/stuGetGroupinfo', function (req, res){
	var group_id = req.param('group_id');
	var username = req.param('username');//可选，如果有则返回参数中附带 这个用户是否关注这个社团
	information.stuGetGroupinfo(req, res, group_id, username);
});

router.use('/getDynamics', function (req, res){
	var group_id = req.param('group_id');
	information.getGroupDynamics(req, res, group_id);
});
module.exports = router;