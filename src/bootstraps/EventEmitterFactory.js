var util         = require("util");
var EventEmitter = require("events").EventEmitter;
var _=require('lodash');
module.exports= {
	parent:'ginger.bootstraps.Default',
	makeObjectEventEmitter:function(obj){
		var ee = new EventEmitter();
		for(var k in ee){
			if(obj[k]){
				continue;
			}
			if(typeof(ee[k])=='function'){
				obj[k]=ee[k].bind(obj);
			}
			else{
				obj[k]=ee[k];
			}
		}
		return obj;
	}
};