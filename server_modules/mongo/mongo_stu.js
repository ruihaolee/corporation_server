//学生的mongo操作
var mongoose = require('./mongoose.js');
//mongoose.connect('localhost:27017/corporation');

var db = mongoose.connection;
var userSchema = new mongoose.Schema({
	usernumber : {type : String},
	password : {type : String},
	username : {type : String},
	idcard : {type : String},
	sex : {type : String},
	userClass : {type : String},
	goodList : {type : Array},
	sayList : {type : Array},
	watchList : {type : Array} 
});	

userSchema.statics.findByUsernumber = function (usernumber, callBack){
	return this.model('studentsColl').find({usernumber : usernumber}, callBack);
};

var userModle = db.model('studentsColl', userSchema);
//检测数据库是否有这个学生
var ifHaveStudent = function (usernumber, callBack){
	//console.log(callBack);
	userModle.findByUsernumber(usernumber, function (error, result){
		var flag = null;
		console.log(result.length);
		if (result.length == 0) {
			flag = false;
		}
		else 
			flag = true;
		//console.log(callBack);
		callBack(flag);
	});
};
//检测学生用户名密码是否正确
var checkStudent = function(userData, callBack){
	userModle.findByUsernumber(userData.username, function (error, result){
		var thisStudent = result[0];
		//console.log(thisStudent);
		if (thisStudent.password == userData.password) {
			callBack(true);
		}
		else
			callBack(false);
	});
};
//新增学生
var addStudent = function(userData, callBack){
	ifHaveStudent(userData.usernumber, function (result){
		if(!result){
			userModle.create(userData, function (error){
				if(error){
					console.log(error);
				}
				if (callBack) {
					callBack();
				}
			});			
		}
	});
};
//获得学生信息
var getStudentInfo = function(usernumber, callBack){
	userModle.findByUsernumber(usernumber, function (error, result){
		var userData = result[0];
		//delete userData.password;
		userData.password = '';
		//console.log(userData.password);
		callBack(userData);
	});
};

var addArrayValue = function (usernumber, pushValue, whichArray, callBack){
	var addObject = {};
	switch(whichArray){
		case 'goodList':
			addObject = {'$addToSet':{'goodList' : pushValue}};
			break;
		case 'sayList':
			addObject = {'$addToSet':{'sayList' : pushValue}};
			break;
		case 'watchList':
			addObject = {'$addToSet':{'watchList' : pushValue}};
			break;
	}
	userModle.update({usernumber : usernumber}, addObject, function (err){
		if (err) {
			console.log(err);
		}
		if (callBack) {
			callBack();
		}
	});
};

var deleteArrayValue = function (usernumber, deleteValue, whichArray, callBack){
	var deleteObject = {};
	switch(whichArray){
		case 'goodList':
			deleteObject = {'$pull':{'goodList' : deleteValue}};
			break;
		case 'sayList':
			deleteObject = {'$pull':{'sayList' : deleteValue}};
			break;
		case 'watchList':
			deleteObject = {'$pull':{'watchList' : deleteValue}};
			break;
	}
	userModle.update({usernumber : usernumber}, deleteObject, function (err){
		if(err){
			console.log(err);
		}
		if(callBack){
			callBack();
		}
	});
};

exports.deleteArrayValue = deleteArrayValue;
exports.addArrayValue = addArrayValue;
exports.ifHaveStudent = ifHaveStudent;
exports.addStudent = addStudent;
exports.checkStudent = checkStudent;
exports.getStudentInfo = getStudentInfo;