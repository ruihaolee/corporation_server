//获取信息
var mongoose = require('../mongo/mongo_stu');
var responseJson = require('../responseJson');

var getInfo = function(username, req, res){
	if (req.session.usernumber && req.session.usernumber == username) {
		mongoose.getStudentInfo(username, function (data){
			 console.log(data);
			 responseJson(res, true, data);
		});
	}
	else{
		responseJson(res, false, "No Session. Access Denied")
	}
}

module.exports = getInfo;