var mongo_dynamic = require('../mongo/mongo_dynamic');
var responseJson = require('../responseJson');

var getAllDynamics = function (req, res){
	mongo_dynamic.getAllDynamics(function (allDynamics){
		responseJson(res, true, allDynamics);
	});
};

module.exports = getAllDynamics;