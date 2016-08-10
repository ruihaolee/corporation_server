var mongoose = require('./mongoose.js');
//mongoose.connect('localhost:27017/corporation');

var db = mongoose.connection;
var groupSchema = new mongoose.Schema({
	groupName : {type : String},
	groupProfile : {type : String},
	groupLoginName : {type : String},
	groupLoginPassword : {type : String},
	headName : {type : String},
	headNumber : {type : String},
	headPassWord : {type : String},
	headPhone : {type : String},
	dynamicList : {type : Array},
	getStudentList : {type : Array}
});

var groupModle = db.model('groupsColl', groupSchema);

var ifHaveGroup = function(groupName, groupLoginName, callBack){
	groupModle.find({"$or": [{groupName : groupName}, {groupLoginName : groupLoginName}]}, function (err, result){
		var flag = null;
		if (result.length == 0) {
			flag = false;
		}
		else
			flag = true;
		callBack(flag, result[0]);
	});
};
var addGroup = function (groupData, callBack){
	groupModle.create(groupData, function (err){
		if (err) {
			console.log(err);
		}
		if (callBack) {
			callBack();
		}
	});	
};
var checkGroup = function(loginData, callBack){
	groupModle.find({groupLoginName : loginData.groupLoginName}, function (err, result){
		if(err){
			console.log(err);
			return;
		}
		else if (result.length == 0) {
			callBack(false, '社团账号尚未注册.');
			return;
		}
		else if(result[0].groupLoginPassword != loginData.groupLoginPassword){
			callBack(false, '密码错误,请检查！');
			return;
		}
		else{
			callBack(true, result[0]);
			return;
		}
	})
};

var getGroupInfo = function (group_id, callBack){
	console.log(group_id);
	groupModle.find({_id : group_id}, function (err, result){
		console.log(result);
		if (err) {//找不 group_id对应的社团
			// console.log(err);
			callBack(false);
			return;
		}
		if (callBack) {
			callBack(result[0]);
		}
	});
};

var addArrayValue = function (group_id, pushValue, whichArray, callBack){
	var addObject = {};
	switch(whichArray){
		case 'getStudentList':
			addObject = {'$addToSet':{'getStudentList' : pushValue}};
			break;
		case 'dynamicList':
			addObject = {'$addToSet':{'dynamicList' : pushValue}};
			break;
	}
	groupModle.update({_id : group_id}, addObject, function (err){
		if (err) {
			console.log(err);
		}
		if (callBack) {
			callBack();
		}
	});
};

var deleteArrayValue = function (group_id, deleteValue, whichArray, callBack){
	var deleteObject = {};
	switch(whichArray){
		case 'getStudentList':
			deleteObject = {'$pull':{'getStudentList' : deleteValue}};
			break;
		case 'dynamicList':
			deleteObject = {'$pull':{'dynamicList' : deleteValue}};
			break;
	}
	groupModle.update({_id : group_id}, deleteObject, function (err){
		if (err) {
			console.log(err);
		}
		if (callBack) {
			callBack();
		}
	});	
};

var findGroupList = function(idArray, callBack){
	groupModle.find({"_id" : {"$in" : idArray}}, function (err, result){
		console.log(result);
		if (callBack) {
			callBack(result);
		}
	});	
};
// var checkLoginNum = function(loginNumber, callBack){
// 	groupModle.find({groupLoginName : loginNumber}, function(err, result){
// 		if (err) {
// 			console.log(err);
// 			return;
// 		}
// 		if (callBack) {
// 			callBack(result);
// 		}
// 	});
// };
// exports.checkLoginNum = checkLoginNum;
// 
// 
exports.findGroupList = findGroupList;
exports.deleteArrayValue = deleteArrayValue;
exports.addArrayValue = addArrayValue;
exports.getGroupInfo = getGroupInfo;
exports.checkGroup = checkGroup;
exports.ifHaveGroup = ifHaveGroup;
exports.addGroup = addGroup;