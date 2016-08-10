//验证码
var ccap = require('ccap');
var captcha = ccap({
	width : 256,
	height : 60,
	offset : 40,
	quality : 100
});

var changeVerCode = function (req, res){
	var captchaArr = captcha.get();
	var captchaText = captchaArr[0],
		captchaBuffer = captchaArr[1];
	req.session.verCode = captchaText.toUpperCase();
	res.end(captchaBuffer);
}
module.exports = changeVerCode;