var express = require('express');

var followAct = require('../server_modules/action/follow');
var comment = require('../server_modules/action/comment');
var pushDynamic = require('../server_modules/corporation/message');
var clickGood = require('../server_modules/action/clickGood');
var getAllDynamics = require('../server_modules/action/getAllDynamic');
var router = express.Router();

router.use('/follow', function (req, res){
	var followData = {
		usernumber : req.param('username'),
		group_id : req.param('group_id')
	};
	followAct.follow(req, res, followData);
});

router.use('/unfollow', function (req, res){
	var unfollowData = {
		usernumber : req.param('username'),
		group_id : req.param('group_id')
	};
	followAct.unfollow(req, res, unfollowData);
});

router.use('/pushDynamic', function (req, res){
	var dynamicData = {
		group_id : req.param('group_id'),
		dynamicTitle : req.param('title'),
		dynamicContent : req.param('content'),
	};
	pushDynamic(req, res, dynamicData);
});

router.use('/studentPushComment', function (req, res){
	var stuComment = {
		usernumber : req.param('usernumber'),
		dynamic_id : req.param('dynamic_id'),
		content : req.param('content')
	};
	comment.studentPushComment(req, res, stuComment);
});

router.use('/groupReplyComment', function (req, res){
	var groupReply = {
		dynamic_id : req.param('dynamic_id'),
		content : req.param('content'),
		reply_who : req.param('reply_who'),
		group_id : req.param('group_id')
	};
	comment.groupReplyComment(req, res, groupReply);
});

router.use('/clickGood', function (req, res){
	var goodData = {
		dynamic_id : req.param('dynamic_id'),
		usernumber : req.param('usernumber')
	};
	clickGood.good(req, res, goodData);
});

router.use('/unClickGood', function (req, res){
	var ungoodData = {
		dynamic_id : req.param('dynamic_id'),
		usernumber : req.param('usernumber')		
	};
	clickGood.ungood(req, res, ungoodData);
});

router.use('/getAllDynamics', function (req, res){
	getAllDynamics(req, res);
});

module.exports = router;