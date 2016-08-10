//推送信息
var mongo_dynamic = require('../mongo/mongo_dynamic');
var mongo_group = require('../mongo/mongo_group');
var responseJson = require('../responseJson');

var updateComment = function(res, thisDynamic){
	var newDynamicData = {};
	var needArr = ['groupName', 'dynamicContent', 'group_id', 'time', 'good', 'comment', 'dynamicTitle'];
	var _id = thisDynamic._id;

	for(var i = 0; i < needArr.length; i++){
		newDynamicData[needArr[i]] = thisDynamic[needArr[i]];
	}

	newDynamicData.comment = {_110 : 'hahaha'};
	console.log(newDynamicData);
	mongo_dynamic.updateDynamicComment(_id, newDynamicData, function(){
		responseJson(res, true, '动态发表成功');
	});
};
var pushDynamic = function(req, res, dynamicData){
	if(req.session.group_id && (req.session.group_id == dynamicData.group_id)){
		if(!req.session.lastPushTime){
			req.session.lastPushTime = Date.parse(new Date());
		}
		else{
			var nowTime = Date.parse(new Date());
			var timeCut = (nowTime - req.session.lastPushTime) / 1000;
			if(timeCut < 60){
				var reasonString = '推送状态太过频繁,请' + (60 - timeCut) + 'S 后再推送';
				responseJson(res, false, reasonString);
				return;
			}
			req.session.lastPushTime = nowTime;
		}

		var mongo_dynamicData = {};
		for(var name in dynamicData){
			mongo_dynamicData[name] = dynamicData[name];
		}
		mongo_group.getGroupInfo(dynamicData.group_id, function (groupData){
			mongo_dynamicData.groupName = groupData.groupName;
			var nowDate = new Date();
			mongo_dynamicData.time = nowDate.toLocaleString();
			mongo_dynamicData.good = [];

			mongo_dynamic.addDynamic(mongo_dynamicData, function (thisDynamic){
				//updateComment(res, thisDynamic);			
				mongo_group.addArrayValue(dynamicData.group_id, thisDynamic._id, 'dynamicList', function(){
					responseJson(res, true, '动态发表成功');
				});
			});	
		});
	}
	else{
		responseJson(res, false, 'No Session. Access Denied');
	}
};
module.exports = pushDynamic;