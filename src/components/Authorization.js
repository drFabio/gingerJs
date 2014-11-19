var _=require('lodash');
var async=require('async');
module.exports= {
	init:function(engine,params) {
		this._super(engine,params);
		this._permissionResolvers={};
		this._roleResolvers={};
	},
	_parseRules:function(rules){
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
		return rulesToAdd;
	},
	addRoleResolver:function(role,resolver){
		this._roleResolvers[role]=resolver;
	},
	addPermissionResolver:function(permission,resolver){
		this._permissionResolvers[permission]=resolver;
	},
	setRules:function(rules){
		this._rules=this._parseRules(rules);
	},
	getAccessRequirements:function(controller,action){
		var ret={role:[],permission:[]};
		var self=this;	
		if(this._rules){
			this._rules.forEach(function(r){
				//First we see if it's included
				if(self._isRuleApplicable(r,controller,action)){
					ret.role=ret.role.concat(r.role);
					ret.permission=ret.permission.concat(r.permission);
				}

			});
		}
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
	},
	isUserAllowed:function(user,req,controller,action,cb){
		var requirements=this.getAccessRequirements(controller,action);
		
		var funcsToExecute=[];
		var self=this;
		if(!_.isEmpty(requirements.role)){
			requirements.role.forEach(function(r){
				funcsToExecute.push(function(asyncCb){
					self._checkIfUserHasRole(user,req,r,asyncCb);
				});
			});
		}
		if(!_.isEmpty(requirements.permission)){
			requirements.permission.forEach(function(p){
				funcsToExecute.push(function(asyncCb){
					self._checkIfUserHasPermission(user,req,p,asyncCb);
				});
			});
		}
		if(_.isEmpty(funcsToExecute)){
			cb(null,true);
			return;
		};
		async.parallel(funcsToExecute,function(err,data){
			if(err){
				cb(err);
				return;
			}
			cb(null,true);
		});

	},
	_checkIfUserHasRole:function(user,req,role,cb){
		if(this._roleResolvers[role]){
			this._roleResolvers[role](user,req,role,cb);
			return;
		}
		if(!!user.roles && user.roles.indexOf(role)>=0){
			cb(null,true);
			return;
		}
		cb(this._engine.getError('Forbidden'));
	},
	_checkIfUserHasPermission:function(user,req,permission,cb){
		if(this._permissionResolvers[permission]){
			this._permissionResolvers[permission](user,req,permission,cb);
			return;
		}
		if(!!user.permissions && user.permissions.indexOf(permission)>=0){
			cb(null,true);
			return;
		}
		cb(this._engine.getError('Forbidden'));
	},

};

