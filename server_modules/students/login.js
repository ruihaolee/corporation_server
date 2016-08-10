//登陆与注销
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var mongo_stu = require('../mongo/mongo_stu');
var responseJson = require('../responseJson');

var notInMongo = {
	getInfo : function(userData, session, callBack){
		var mainUrl = 'http://222.24.62.120/xs_main.aspx?xh=' + userData.username;
		request({
			url : mainUrl,
			method : 'GET',
			encoding : null,//取消默认编码
			headers : {
				Referer: "http://222.24.62.120/default2.aspx",
				Cookie : session
			}
		}, function (err, res, body){
			body = iconv.decode(body, 'gb2312');
			var rule = /<a href="xsgrxx\.aspx\?([^"]+)"/;
			var resultParam = body.match(rule);
			var name = resultParam[1].match(/xm=(.+)&gnmkdm/)[1];
			var infoUrl = 'http://222.24.62.120/xsgrxx.aspx?xh=' + userData.username + '&xm=' + encodeURI(name) + '&gnmkdm=N121501';
			// var infoUrl = 'http://222.24.62.120/xsgrxx.aspx?xh=04141197&xm=%C0%EE%EE%A3%BA%C0&gnmkdm=N121501';
			//console.log(infoUrl);
			request({
				url : infoUrl,
				method : 'GET',
				encoding : null,
				headers: {
					Referer: 'http://222.24.62.120/xs_main.aspx?xh=04141197',
					Cookie : session
				}
			}, function (err, res, body){
				body = iconv.decode(body, 'gb2312');
				var $ = cheerio.load(body);
				var studentInfo = {
					usernumber : userData.username,
					password : userData.password,
					username : $('#xm').text(),
					idcard : $('#lbl_sfzh').text(),
					sex : $('#lbl_xb').text(),
					userClass : $('#lbl_xzb').text(),
					goodList : [],
					sayList : [],
					watchList : []  
				};
				//console.log(studentInfo);
				mongo_stu.addStudent(studentInfo, function(){
					delete studentInfo.password;
					callBack(true, studentInfo);
					//responseJson(response, true, studentInfo);					
				});
			});
		});
	},
	simulation_login : function(userData, req, callBack){
		var loginResult = null;
		var url = 'http://222.24.62.120/default4.aspx';
		var postData = {
			'TextBox1' : userData.username,
			'TextBox2' : userData.password,
			'__VIEWSTATE': "dDwxMTE4MjQwNDc1Ozs+YofaNxf5dpXqcC3ZAqYdKfPCdbw=",
			'RadioButtonList1': "%D1%A7%C9%FA",
			'Button1': "+%B5%C7+%C2%BC+"		
		};
		
		request({
			method : 'POST',
			url : url,
			form : postData
		},function (err, res, body){
			if (err) {
				console.log(err);
				return;
			}
			var loginUrl = /<title>Object moved<\/title>/;
			var index = body.search(loginUrl);
			if (index != -1) {
				req.session.usernumber = userData.username;

				var cookieArr = res.headers['set-cookie'];
				session = cookieArr[0].substr(0, cookieArr[0].indexOf(';'));
				notInMongo.getInfo(userData, session, callBack);
			}
			else{
				callBack(false, 'please check your password');
				//responseJson(response, false, 'please check your password');
			}
			//console.log(this.loginResult);
		});
	}
};

var checkFromMongo = function(userData, req, callBack){
	mongo_stu.checkStudent(userData, function (result){
		//console.log(result);
		if (result) {
			req.session.usernumber = userData.username;
			mongo_stu.getStudentInfo(userData.username, function (data){
				callBack(true, data);
			});
		}
		else{
			callBack(false, 'please check your password');
		}
	});
}

var login = function(userData, req, callBack){
	mongo_stu.ifHaveStudent(userData.username, function (result){
		if (!result) {//不存在
			notInMongo.simulation_login(userData, req, callBack);
			console.log('不存在');
		}
		else {
			checkFromMongo(userData, req, callBack);
			console.log('存在');
		}
	});
};
var cancelLogin = function(req, res){
	if (req.session.usernumber) {
		res.cookie('node_sessionId', null, {maxAge:0});
		delete req.session.usernumber;
		responseJson(res, true, 'Cancel Successfully');
	}
	else{
		responseJson(res, false, 'No Login');
	}
};

var justLogin = function(userData, req, res){
	login(userData, req, function (resultBool, data){
		responseJson(res, resultBool, data);
	});
};

exports.verLogin = login;
exports.login = justLogin;
exports.cancelLogin = cancelLogin;
