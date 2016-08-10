//点赞和取消赞
var mongo_dynvmic = require('../mongo/mongo_dynamic');
var mongo_stu = require('../mongo/mongo_stu');
var responseJson = require('../responseJson');

var clickGood = function (req, res, goodData){
	if (req.session.usernumber && (req.session.usernumber == goodData.usernumber)) {
		mongo_dynvmic.getOneDynamic(goodData.dynamic_id, function (result){
			// console.log(result);
			if (result) {
				mongo_dynvmic.updateDynamicGood(goodData.dynamic_id, goodData.usernumber, function(){
					mongo_stu.addArrayValue(goodData.usernumber, goodData.dynamic_id, 'goodList', function(){
						responseJson(res, true, '点赞成功!');
					});
				});				
			}
			else{
				responseJson(res, false, '请检查状态ID');
			}
		});
	}
	else{
		responseJson(res, false, '操作失败，请先登录');
	}
};

var unClickGood = function (req, res, ungoodData){
	if (req.session.usernumber && (req.session.usernumber == ungoodData.usernumber)){
		mongo_dynvmic.getOneDynamic(ungoodData.dynamic_id, function (result){
			if (result) {
				mongo_dynvmic.cancelDynamicGood(ungoodData.dynamic_id, ungoodData.usernumber, function(){
					mongo_stu.deleteArrayValue(ungoodData.usernumber, ungoodData.dynamic_id, 'goodList', function(){
						responseJson(res, true, '取消成功!');
					});
				});				
			}
			else{
				responseJson(res, false, '请检查状态ID');
			}
		});		
	}
	else{
		responseJson(res, false, '操作失败，请先登录');
	}	
};

exports.ungood = unClickGood;
exports.good = clickGood;