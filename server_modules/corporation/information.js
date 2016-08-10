//获取社团信息/社团粉丝/社团发布的历史状态
var mongo_group = require('../mongo/mongo_group');
var mongo_stu = require('../mongo/mongo_stu');
var mongo_dynamic = require('../mongo/mongo_dynamic');
var responseJson = require('../responseJson');

var groupInfo = function(req, res, group_id){
	if (req.session.group_id && (req.session.group_id == group_id)) {
		mongo_group.getGroupInfo(group_id, function (groupData){
			responseJson(res, true, groupData);
		});
	}
	else{
		responseJson(res, false, 'No Session. Access Denied');
	}
};//社团获得社团的全部信息，须session.  包含粉丝

var stuGetGroupinfo = function(req, res, group_id, username){
	console.log(username);

	mongo_group.getGroupInfo(group_id, function (groupData){
		var responseObj = {};
		var needArr = ['groupName', 'groupProfile', 'headName', 'headPhone', 'dynamicList', 'getStudentList', '_id'];
		for(var i = 0; i < needArr.length; i++){
			responseObj[needArr[i]] = groupData[needArr[i]];
		}

		if (username) {
			mongo_stu.getStudentInfo(username, function (stuData){
				var followArr = stuData.watchList;
				for(var i = 0; i < followArr.length; i++){
					if (followArr[i] == group_id) {
						responseObj.ifHadFollow = true;
						break;
					}
				}
				if (i == followArr.length) {
					responseObj.ifHadFollow = false;
				}

				responseJson(res, true, responseObj);
			});
		}
		else
			responseJson(res, true, responseObj);
	});
};//学生获取社团信息

var getGroupDynamics = function (req, res, group_id){
	if (req.session.group_id && (req.session.group_id == group_id)) {
		mongo_dynamic.getGroupDynamics(group_id, function (dynamics){
			responseJson(res, true, dynamics);
		});
	}
	else{
		responseJson(res, false, 'No Session. Access Denied');
	}
};//获得历史状态

exports.getGroupDynamics = getGroupDynamics;
exports.stuGetGroupinfo = stuGetGroupinfo;
exports.groupInfo = groupInfo;