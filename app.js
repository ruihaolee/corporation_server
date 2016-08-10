var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var students = require('./routes/students');
var groups = require('./routes/groups');
var actions = require('./routes/actions');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//开启session服务
app.use(cookieParser());
app.use(session({
	secret : '12345',
	name : 'node_sessionId',
	cookie : {maxAge : 8000000}, //设置cookie最大时长
	resave : true,
	saveUninitialized: false	
}));

app.use('/students', students);
app.use('/groups', groups);
app.use('/actions', actions);
app.listen(3738);