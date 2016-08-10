var responseJson = function (res, success, data){
	if (!success) {
		res.jsonp({
			success : success,
			reason : data 
		});
	}
	else{
		res.jsonp({
			success : success,
			result : data
		});
	}
};

module.exports = responseJson;