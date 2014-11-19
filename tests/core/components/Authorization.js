var authorizationComponent;
var async=require('async');
var _=require('lodash');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var fixtures=utils.fixtures;
var rulesToParse=[
	//Apply to everybody except all actions of login and #action of someController
	{
		include:'*',
		exclude:['login','someController#action'],
		role:'authenticated',
		permission:'permissionC'

	},
	//This controller should have multiple permissions
	{
		include:['someController#action'],
		permission:['permissionA','permissionB']
	},
	{
		include:['someController','anotherController'],
		exclude:['someController#action'],
		role:'manager'
	},
	{
		include:['someController#dynamicAction'],
		permission:'dynamicPermission',
		role:'dynamicRole'
	},
];
describe('Component Authorization',function(){
	var ginger;
	//Initializing the app by path first
	before(function(done){
		var cb=function(err){
			if(err){
				done(err);
				return;
			}
			ginger=utils.getServer();
			authorizationComponent=ginger.getComponent('Authorization');
			authorizationComponent.setRules(rulesToParse);
			authorizationComponent.addPermissionResolver('dynamicPermission',function(user,req,role,cb){
				if(req.query.a='b'){
					cb(null,true);
					return;
				}
				cb(ginger.getError('Forbidden'));
			});
			authorizationComponent.addRoleResolver('dynamicRole',function(user,req,role,cb){
				if(req.query.a='b'){
					cb(null,true);
					return;
				}
				cb(ginger.getError('Forbidden'));
			});
			done();

		}
		utils.initServer(cb);
	});
	describe('Initialization',function(){
		it('Should be able to get the rules for a given controller action',function(){
			var access=authorizationComponent.getAccessRequirements('anyController','anyAction');
			
			expect(access.role.indexOf('authenticated')).to.be.at.least(0);
			expect(access.permission.indexOf('permissionC')).to.be.at.least(0);

			access=authorizationComponent.getAccessRequirements('login','anyAction');
			expect(access.role.indexOf('authenticated')).to.equal(-1);
			expect(access.permission.indexOf('permissionC')).to.equal(-1);

			access=authorizationComponent.getAccessRequirements('someController','action');
			expect(access.role.indexOf('authenticated')).to.equal(-1);
			expect(access.role.indexOf('manager')).to.equal(-1);
			expect(access.permission.indexOf('permissionC')).to.equal(-1);
			expect(access.permission.indexOf('permissionA')).to.be.at.least(0);
			expect(access.permission.indexOf('permissionB')).to.be.at.least(0);

			access=authorizationComponent.getAccessRequirements('someController','anotherAction');
			expect(access.role.indexOf('manager')).to.be.at.least(0);
		});
		it('Should be able to check static permissions',function(done){
			var user={
				'permissions':['permissionC']
			}
			authorizationComponent._checkIfUserHasPermission(user,null,'permissionC',function(err,hasPermission){
				expect(hasPermission).to.be.true;
				authorizationComponent._checkIfUserHasPermission(user,null,'permissionD',function(err,hasPermission){
					expect(err).to.be.exist;
					expect(err.code).to.equal('FORBIDDEN');
					done();
				});
			});
		});
		it('Should be able to check static roles',function(done){
			var user={
				'roles':['roleA']
			}
			authorizationComponent._checkIfUserHasRole(user,null,'roleA',function(err,hasPermission){
				expect(hasPermission).to.be.true;
				authorizationComponent._checkIfUserHasRole(user,null,'roleB',function(err,hasPermission){
					expect(err).to.be.exist;
					expect(err.code).to.equal('FORBIDDEN');
					done();
				});
			});
		});

		it('Should be able to check dynamic permissions',function(done){
			var user={}
			authorizationComponent._checkIfUserHasPermission(user,{'query':{'a':'b'}},'dynamicPermission',function(err,hasPermission){
				expect(hasPermission).to.be.true;
				done();
			});
		});
		it('Should be able to check dynamic roles',function(done){
			var user={}
			authorizationComponent._checkIfUserHasRole(user,{'query':{'a':'b'}},'dynamicRole',function(err,hasPermission){
				expect(hasPermission).to.be.true;
				done();
			});
		});
		it('Should be able to check if a user has access to controllers and actions',function(done){
			var user={
				'permissions':['permissionC'],
				'roles':['manager','authenticated']
			}
			var req={'query':{'a':'b'}};
			var expectError=function(asyncCb){
				return function(err,data){
					expect(err).to.exist;
					expect(err.code).to.equal('FORBIDDEN');
					asyncCb();
				}
			}
			var expectSuccess=function(asyncCb){
				return function(err,data){
					expect(err).to.not.exist;
					expect(data).to.be.true;
					asyncCb();
				}
			}
			var userb={
				'permissions':['permissionA','permissionB'],
			}
			var functionsToExecute=[
				function(asyncCb){
					authorizationComponent.isUserAllowed(user,req,'someController','dynamicAction',expectSuccess(asyncCb));
				},
				function(asyncCb){
					authorizationComponent.isUserAllowed(user,req,'someController','action',expectError(asyncCb));
				},
				function(asyncCb){
					authorizationComponent.isUserAllowed(userb,req,'someController','action',expectSuccess(asyncCb));
				}
			];
			async.parallel(functionsToExecute,function(err,data){
				done();
			})
		});
	});

	after(function(done){
		utils.endServer(done);
	});
});