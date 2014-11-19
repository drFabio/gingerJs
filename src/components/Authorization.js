var _=require('lodash');
module.exports= {
	init:function(engine,params) {
		this._super(engine,params);
	},
	setRules:function(rules){
		var theRule;
		var include;
		var exclude;
		var rulesToAdd=[];
		rules.forEach(function(r){
			theRule=r;
			if(Array.isArray(theRule.include)){
				include=theRule.include;
				theRule.include={};
				include.forEach(function(i){
					theRule.include[i]=true;
				});
			}
			else if(theRule.include){
				var obj={};
				obj[theRule.include]=true;
				theRule.include=obj;
			}
			else{
				theRule.include=[];
			}

			if(Array.isArray(theRule.exclude)){
				exclude=theRule.exclude;
				theRule.exclude={};
				exclude.forEach(function(i){
					theRule.exclude[i]=true;
				});
			}
			else if(theRule.exclude){
				var obj={};
				obj[theRule.exclude]=true;
				theRule.exclude=obj;
			}
			else{
				theRule.exclude=[];
			}


			if(!theRule.role){
				theRule.role=[];
			}
			else if(!Array.isArray(theRule.role)){
				theRule.role=[theRule.role];
			}
			if(!theRule.permission){
				theRule.permission=[];
			}
			else if(!Array.isArray(theRule.permission)){
				theRule.permission=[theRule.permission];
			}
			rulesToAdd.push(theRule);
		});
		this._rules=rulesToAdd;
	},
	getAccessRequirements:function(controller,action){
		var ret={role:[],permission:[]};
		var self=this;	
		this._rules.forEach(function(r){
			//First we see if it's included
			if(self._isRuleApplicable(r,controller,action)){
				ret.role=ret.role.concat(r.role);
				ret.permission=ret.permission.concat(r.permission);
			}

		});
		return ret;
	},
	_isRuleApplicable:function(rule,controller,action){
		var isIncluded=rule.include['*'] || rule.include[controller] ||  rule.include[controller+'#'+action];
		if(!isIncluded){
			return false;
		}
		var isExcluded=rule.exclude['*'] || rule.exclude[controller] ||  rule.exclude[controller+'#'+action];
		if(isExcluded){
			return false;
		}
		return true;
	}


};

