//用户评论和社团回复评论
var mongo_dynvmic = require('../mongo/mongo_dynamic');
var mongo_stu = require('../mongo/mongo_stu');
var mongo_group = require('../mongo/mongo_group');
var responseJson = require('../responseJson');

var deepCloneDynamic = function (cloneDynamic){
	var newDynamic = {};
	var needArr = ['groupName', 'dynamicContent', 'group_id', 'time', 'good', 'comment', 'dynamicTitle'];
	for(var i = 0;i < needArr.length; i++){
		newDynamic[needArr[i]] = cloneDynamic[needArr[i]];
	}
	return newDynamic;
};

var studentPushComment = function (req, res, studentComment){
	console.log(studentComment);
	if (req.session.usernumber && (studentComment.usernumber == req.session.usernumber)) {
		var madeCommentData = {};
		// for(var name in studentComment){
		// 	madeCommentData[name] = studentComment[name];
		// }
		var comment_pro = "_" + studentComment.usernumber;
		mongo_stu.getStudentInfo(studentComment.usernumber, function (stuData){
			madeCommentData.from = stuData.username;
			madeCommentData.content = studentComment.content;
			madeCommentData.usernumber = studentComment.usernumber;
			var nowDate = new Date();
			madeCommentData.time = nowDate.toLocaleString();

			mongo_dynvmic.getOneDynamic(studentComment.dynamic_id, function (dynamicData){
				if (!dynamicData) {
					responseJson(res, false, '请检查评论ID');
					return;
				}	

				var noIdDynamicData = deepCloneDynamic(dynamicData);
				if (noIdDynamicData.comment) {
					if (!noIdDynamicData.comment[comment_pro]) {
						noIdDynamicData.comment[comment_pro] = [];
					}
					noIdDynamicData.comment[comment_pro].push(madeCommentData);
				}
				else{
					noIdDynamicData.comment = {};
					noIdDynamicData.comment[comment_pro] = [];
					noIdDynamicData.comment[comment_pro].push(madeCommentData);
				}
				console.log(noIdDynamicData);
				mongo_dynvmic.updateDynamicComment(dynamicData._id, noIdDynamicData, function(){
					mongo_stu.addArrayValue(studentComment.usernumber, dynamicData._id, 'sayList', function(){
						responseJson(res, true, '评论成功');
					});
				});
			});
		});
	}
	else{
		responseJson(res, false, '操作失败，请先登录');
	}
};

var groupReplyComment = function (req, res, groupReply){
	var reply_who = "_" + groupReply.reply_who;
	if (req.session.group_id && (groupReply.group_id == req.session.group_id)) {
		var madeCommentData = {};
		mongo_group.getGroupInfo(groupReply.group_id, function (groupData){
			madeCommentData.groupName = groupData.groupName;
			madeCommentData.content = groupReply.content;
			var nowDate = new Date();
			madeCommentData.time = nowDate.toLocaleString();

			mongo_dynvmic.getOneDynamic(groupReply.dynamic_id, function (dynamicData){
				if (!dynamicData) {
					responseJson(res, false, '请检查状态ID');
					return;
				}		

				var noIdDynamicData = deepCloneDynamic(dynamicData);
				if (noIdDynamicData.comment) {
					var flag = true;
					for(var name in noIdDynamicData.comment){
						if (name == reply_who) {
							flag = false;
						}
					}
					if (flag) {
						responseJson(res, false, '回复的学生并无评论');
						return;
					}
					else{
						noIdDynamicData.comment[reply_who].push(madeCommentData);
						mongo_dynvmic.updateDynamicComment(groupReply.dynamic_id, noIdDynamicData, function(){
							responseJson(res, true, '回复成功~');
							return;
						});
					}
				}
				else{
					responseJson(res, false, '回复的学生并无评论');
					return;
				}			
			});
		});
	}
	else{
		responseJson(res, false, '操作失败，请先登录');
	}
};

exports.groupReplyComment = groupReplyComment;
exports.studentPushComment = studentPushComment;