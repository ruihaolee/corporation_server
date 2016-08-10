//关注和取消关注
var mongo_stu = require('../mongo/mongo_stu');
var mongo_group = require('../mongo/mongo_group');
var responseJson = require('../responseJson');

var follow = function (req, res, followData){
	if (req.session.usernumber && (followData.usernumber == req.session.usernumber)) {
		mongo_group.getGroupInfo(followData.group_id, function (result){
			console.log(result);
			if (!result) {
				// console.log('group_id错误');
				responseJson(res, false, '社团Id不存在，请检查');
				return;
			}
			
			mongo_group.addArrayValue(followData.group_id, followData.usernumber, 'getStudentList');
			mongo_stu.addArrayValue(followData.usernumber, followData.group_id, 'watchList', function(){
				responseJson(res, true, '关注成功');
			});
		})
	}
	else{
		responseJson(res, false, '关注失败,请先登录');
	}
};

var unfollow = function (req, res, unfollowData){
	if (req.session.usernumber && (unfollowData.usernumber == req.session.usernumber)){
		mongo_stu.getStudentInfo(unfollowData.usernumber, function (stuData){
			var followArr = stuData.watchList;
			var flag = false;
			for(var i = 0; i < followArr.length; i++){
				if (followArr[i] == unfollowData.group_id) {
					flag = true;
					break;
				}
			}

			if(flag){
				mongo_stu.deleteArrayValue(unfollowData.usernumber, unfollowData.group_id, 'watchList');
				mongo_group.deleteArrayValue(unfollowData.group_id, unfollowData.usernumber, 'getStudentList', function(){
					responseJson(res, true, '取消关注成功');
				});
			}	
			else{
				responseJson(res, false, '操作失败,该生没有关注过该社团');
			}		
		});
	}
	else{
		responseJson(res, false, '操作失败，请先登录');
	}
}

exports.unfollow = unfollow;
exports.follow = follow;