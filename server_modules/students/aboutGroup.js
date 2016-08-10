//获得用户 点赞/评论/关注
var mongo_stu = require('../mongo/mongo_stu');
var mongo_dynamic = require('../mongo/mongo_dynamic');
var mongo_group = require('../mongo/mongo_group');
var responseJson = require('../responseJson');

var ifLogin = function(req, res, usernumber, whichList){
	if (req.session.usernumber && (req.session.usernumber == usernumber)) {
		mongo_stu.getStudentInfo(usernumber, function (studentData){
			var list = null;
			if(whichList == 'goodList'){
				list = studentData.goodList;
			}
			else if (whichList == 'sayList') {
				list = studentData.sayList;
			}
			mongo_dynamic.findDynamicList(list, function(result){
				responseJson(res, true, result);
			});			
		});
	}
	else{
		responseJson(res, false, 'No Session. Access Denied');
	}
};

var getGoods = function(req, res, usernumber){//获得点赞的状态
	ifLogin(req, res, usernumber, 'goodList');
};

var getSays = function (req, res, usernumber){//获得评论过的状态
	ifLogin(req, res, usernumber, 'sayList');
};

var getWatch = function (req, res, usernumber){
	if (req.session.usernumber && (req.session.usernumber == usernumber)) {
		mongo_stu.getStudentInfo(usernumber, function (studentData){
			var watchList = studentData.watchList;
			mongo_group.findGroupList(watchList, function(result){
				responseJson(res, true, result);
			});			
		});		
	}
	else{
		responseJson(res, false, 'No Session. Access Denied');		
	}
};

exports.getWatch = getWatch;
exports.getSays = getSays;
exports.getGoods = getGoods;