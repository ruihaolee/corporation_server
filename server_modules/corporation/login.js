//社团登陆和注销
var mongo_group = require('../mongo/mongo_group');
var responseJson = require('../responseJson');

var login = function(req, res, loginData){
	mongo_group.checkGroup(loginData, function (result, reason){
		if (result) {
			if (req.session.group_id) {
				console.log(req.session.group_id);
				responseJson(res, false, '社团已登陆,请勿重复登陆');
				return;
			}
			req.session.group_id = reason._id;
		}
		responseJson(res, result, reason);
	});
};

var cancelLogin = function(req, res){
	if (req.session.group_id) {
		res.cookie('node_sessionId', null, {maxAge:0});
		delete req.session.group_id;
		delete req.session.lastPushTime;
		responseJson(res, true, 'Cancel Successfully');		
	}
	else{
		responseJson(res, false, 'No Group Login');
	}
};

exports.cancelLogin = cancelLogin;
exports.login = login;