var authorizationComponent;
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
			done();

		}
		utils.initServer(cb);
	});
	describe('Initialization',function(){
		it('Should be able to get the rules for a given controller action',function(){
			authorizationComponent.setRules(rulesToParse);
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
	});

	after(function(done){
		utils.endServer(done);
	});
});