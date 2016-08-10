var mongoose = require('./mongoose.js');

var db = mongoose.connection;
var dynamicSchema = new mongoose.Schema({
	groupName : {type : String},
	dynamicTitle : {type : String},
	dynamicContent : {type : String},
	group_id : {type : String},
	time : {type : String},
	comment : {type : mongoose.Schema.Types.Mixed},
	good : {type : Array}
});

var dynamicModle = db.model('dynamicsColl', dynamicSchema);

var addDynamic = function(dynamicData, callBack){//新建
	// console.log(dynamicData);
	dynamicModle.create(dynamicData, function (err, data){
		//console.log(data);
		if(err){
			console.log(err);
			return;
		}
		callBack(data);
	});
};

var updateDynamicComment = function(_id, newDynamicData, callBack){//更新
	// console.log(newDynamicData);
	dynamicModle.update({_id : _id}, newDynamicData, function (err){
		if(err){
			console.log(err);
		}
		if(callBack){
			callBack();
		}
	});
};//更新整个状态

var getGroupDynamics = function (group_id, callBack){
	dynamicModle.find({group_id : group_id}, function (err, result){
		if (err) {
			console.log(err);
			return;
		}
		else{
			callBack(result);
		}
	});
};//获取一个社团的全部状态

var getOneDynamic = function(dynamic_id, callBack){
	dynamicModle.find({_id : dynamic_id}, function (err, result){
		if (err) {
			console.log(err);
			callBack(null);
			return;
		}
		if (callBack) {
			callBack(result[0]);
		}
	});
};//通过Id获取某一个状态

var updateDynamicGood = function (dynamic_id, pushValue, callBack){
	dynamicModle.update({_id : dynamic_id}, {'$addToSet':{'good' : pushValue}}, function (err){
		if (err) {
			console.log(err);
			return;
		}
		if (callBack) {
			callBack();
		}
	});
};

var cancelDynamicGood = function (dynamic_id, deleteValue, callBack){
	dynamicModle.update({_id : dynamic_id}, {'$pull' : {'good' : deleteValue}}, function (err){
		if (err) {
			console.log(err);
			return;
		}
		if (callBack) {
			callBack();
		}
	});
};

var findDynamicList = function(idArray, callBack){
	dynamicModle.find({"_id" : {"$in" : idArray}}, function (err, result){
		console.log(result);
		if (callBack) {
			callBack(result);
		}
	});
};

var getAllDynamics = function(callBack){
	dynamicModle.find({}, function (err, result){
		if(err){
			console.log(err);
			return;
		}
		if (callBack) {
			callBack(result);
		}
	})
};

exports.getAllDynamics = getAllDynamics;
exports.findDynamicList = findDynamicList;
exports.cancelDynamicGood = cancelDynamicGood;
exports.updateDynamicGood = updateDynamicGood;
exports.getOneDynamic = getOneDynamic;
exports.getGroupDynamics = getGroupDynamics;
exports.updateDynamicComment = updateDynamicComment;
exports.addDynamic = addDynamic; 