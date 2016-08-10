//社团注册
var mongo_group = require('../mongo/mongo_group');
var studentsLogin = require('../students/login');
var responseJson = require('../responseJson');

var dataHandle = {
	checkData : function(groupData){
		var flag = true;
		var paramNumber = 0;
		for(var name in groupData){
			if (!groupData[name]) {
				flag = false;
				break;
			}
			if (name == 'headPhone') {
				var phoneRule = /^\d{11}$/;
				var re = groupData[name].search(phoneRule);
				if (re == -1) {
					flag = false;
				}
			}
			paramNumber++;
		}
		if (paramNumber != 8) {
			flag = false;
		}
		return flag;
	},
	madeData : function(res, groupData){
		var mongoGroupData = {};
		delete groupData.verCode;
		for(var name in groupData){
			mongoGroupData[name] = groupData[name];
		}
		mongoGroupData.dynamicList = [];
		mongoGroupData.getStudentList = [];
		//console.log(mongoGroupData);
		mongo_group.ifHaveGroup(mongoGroupData.groupName, mongoGroupData.groupLoginName, function (flag, hadGroup){
			console.log(flag);
			if (!flag) {
				mongo_group.addGroup(mongoGroupData, function(){
					responseJson(res, true, mongoGroupData);
				});
			}
			else{
				console.log(hadGroup);
				var reason = '注册失败';
				if (hadGroup.groupName == mongoGroupData.groupName) {
					reason += '.社团名称已存在';
				}
				if (hadGroup.groupLoginName == mongoGroupData.groupLoginName) {
					reason += '.社团登陆账号已存在';
				}
				responseJson(res, false, reason);
			}
		});
		//检测社团名和负责人是否重复
	}
};
var register = function(req, res, groupData){
	var checkResult = dataHandle.checkData(groupData);
	if (!checkResult) {
		responseJson(res, false, '请检查参数是否符合要求');
		return;
	}
	var headData = {
		username : groupData.headNumber,
		password : groupData.headPassWord
	};
	studentsLogin.verLogin(headData, {session:[]}, function (resultBool, data){
		console.log(req.session.verCode);
		console.log(groupData.verCode.toUpperCase());
		//console.log(groupData.verCode.toUpperCase());
		if (!resultBool) {
			responseJson(res, false, '负责人信息错误');
			return;
		}
		else if(req.session.verCode != groupData.verCode.toUpperCase()){

			responseJson(res, false, '请检查验证码是否正确');
			return;
		}
		groupData.headName = data.username;
		dataHandle.madeData(res, groupData);
	});

	
};

module.exports = register;