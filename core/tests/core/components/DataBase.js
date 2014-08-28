var databaseComponent;
var createObjectId = require('pow-mongodb-fixtures').createObjectId;
var _=require('lodash');
var async=require('async');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var fixtures=utils.fixtures;
var fixtureData=utils.getFixtureData('login');
var totalLoginData=Object.keys(fixtureData.login).length;

describe('Component database',function(){
	var ginger;
	//Initializing the app by path first
	before(function(done){
		var cb=function(err){
			if(err){
				done(err);
				return;
			}
			ginger=utils.getServer();
			databaseComponent=ginger.getComponent('DataBase');
			done();

		}
		utils.initServer(cb);
	});

	describe('read',function(){
		before(function(done){
			fixtures.clearAndLoad(fixtureData,done);
		});
		describe('By id',function(){
			describe('Failure',function(){
				it('Should return invalid params if the id is not valid ',function(done){
					databaseComponent.readById('login','NotRelevant',function(err,data){
						expect(err).to.exist;
						expect(err.code).to.equal('INVALID_PARAMS');
						done();
					});
				});
				it('Should return not found if the id is not found ',function(done){
					databaseComponent.readById('login',createObjectId(),function(err,data){
						expect(err).to.exist;
						expect(err.code).to.equal('NOT_FOUND');
						done();
					});
				});
			});
			describe('success',function(){
				it('Should find the element by id successfuly',function(done){
					var id=fixtureData.login.user1._id.toString();
					databaseComponent.readById('login',id,function(err,data){
					
						expect(data._id.toString()).to.equal(id);
						done();
					});
				});
				it('Should be able to restrict the fields',function(done){
					var id=fixtureData.login.user1._id.toString();
					var cb=function(err,data){
					
						expect(data._id.toString()).to.equal(id);
						var expectKeys=['email','_id'];
						var keys=Object.keys(data);
						var intersection=_.intersection(keys,expectKeys);
						var sizeResponse=keys.length;
						var intersectionSize=intersection.length;
						expect(intersectionSize).to.equal(sizeResponse);
						done();
					};
					var fields='email';
					databaseComponent.readById('login',id,cb,fields);
				});
			});
		});
		describe('One',function(){
		});
		describe(' normal ',function(){
		});
	});
	describe('Create',function(){
		beforeEach(function(done){
			fixtures.clearAndLoad(fixtureData,done);
		});
		describe('Failure',function(){
			describe('Validation',function(){
			});
			it('Should not be able to create  without required fields');
		});
		it('Should execute successfuly ',function(done){
			var data={
				'email':'bar@baz.com',
				'active':true,
				'name':'barBaz',
				'password':'foo',
			}
			var cb=function(err,saveData){
				expect(saveData).to.exist;
				for(var k in data){
					expect(data[k]).to.equal(saveData[k])
				}
				done();
			}
			databaseComponent.create('login',data,cb);
		});
	});
	describe('Update',function(){
		describe('failure',function(){
			it('Should return 0 if no item was updated',function(done){
				var newEmail='newEmail@email.com';
				var notFoundEmail='notFound@notFound.com';
				var cb=function(err,numAffected){
					expect(err).to.not.exist;
					expect(numAffected).to.equal(0);
					done();
				}
				databaseComponent.update('login',{'email':newEmail},{'email':notFoundEmail},cb);
			});
		});
		describe('success',function(){
			beforeEach(function(done){
				fixtures.clearAndLoad(fixtureData,done);
			});
			it('Should happen by mixed params',function(done){
				var email=fixtureData.login.user1.email;
				var newEmail='newEmail@email.com';
				var name=fixtureData.login.user1.name;
				var cb=function(err,data){
					expect(data).to.equal(1);
					done();
				}
				databaseComponent.update('login',{'email':newEmail},{'email':email,'name':name},cb);
			});
			it('Should update multiple instances if they all match',function(done){
				var name=fixtureData.login.user1.name;
				var sizeOfName=0;
				for(var k in fixtureData.login){
					if(fixtureData.login[k].name==name){
						sizeOfName++;
					}
				}
				var newName='new name';
				var cb=function(err,data){
					expect(data).to.equal(sizeOfName);
					done();
				}
				databaseComponent.update('login',{'name':newName},{'name':name},cb);
			});
		});
		describe('By id',function(){
			beforeEach(function(done){
				fixtures.clearAndLoad(fixtureData,done);
			});
			it('Should execute successfuly',function(done){
				var id=fixtureData.login.user1._id.toString();
				var newName='new name';
				var cb=function(err,data){
					expect(data).to.exist
					expect(data._id.toString()).to.equal(id);
					expect(data.name).to.equal(newName);
					
					done();
				}
				databaseComponent.updateById('login',id,{'name':newName},cb);
			});
			it('Should return InvalidParams if the id is not valid',function(done){
				var id='InvalidId';
				var newName='new name';
				var cb=function(err,data){
			
					expect(err).to.exist;
					expect(err.code).to.equal('INVALID_PARAMS');
					
					done();
				}
				databaseComponent.updateById('login',id,{'name':newName},cb);

			});
			it('Should return not found if the id is not found',function(done){
				var id=createObjectId();
				var newName='new name';
				var cb=function(err,data){
					expect(err).to.exist;
					expect(err.code).to.equal('NOT_FOUND');
					
					done();
				}
				databaseComponent.updateById('login',id,{'name':newName},cb);
			});

		});
	});
	describe('Count',function(){
		before(function(done){
			fixtures.clearAndLoad(fixtureData,done);
		});
		it('Should be able to get the total data of a collection',function(done){
			var cb=function(err,data){
				expect(err).to.not.exist;
				expect(data).to.equal(totalLoginData);
				done();
			}
			databaseComponent.count('login',null,cb);
		});
		it('Should be able to get the total data of a collection passing a search param',function(done){
			var activeTotal=0;
			for(var x in fixtureData.login){
				if(fixtureData.login[x].active){
					activeTotal++;
				}
			}
			var cb=function(err,data){
				expect(err).to.not.exist;
				expect(data).to.equal(activeTotal);
				done();
			}
			databaseComponent.count('login',{'active':true},cb)	
		});
	});
	describe('List',function(){
		before(function(done){
			fixtures.clearAndLoad(fixtureData,done);
		});
		it('Should be able to list all data limitless',function(done){
			var cb=function(err,data){
				expect(err).to.not.exist;
				expect(data.total).to.equal(totalLoginData);
				expect(data.results.length).to.equal(totalLoginData);
				done();
			}
			databaseComponent.list('login',null,-1,null,null,null,cb);
		});
		it('Should be able to paginate the data',function(done){
			var cb=function(err,data){
				expect(err).to.not.exist;
				expect(data.total).to.equal(totalLoginData);
				expect(data.results.length).to.equal(5);
				done();
			}
			databaseComponent.list('login',null,5,null,null,null,cb);
		});
		it('Should be able to set which fields are wanted');
		it('Should be able to set which fields are not wanted with -1');
		it('Should be able to set which fields are not wanted with \'-1\'');
		it('Should be able to set which fields are not wanted with false');
		it('Should be able to set which fields are not wanted with \'false\'');
		it('Should be able to sort data');
	});
	describe('Destroy ',function(){
		it('Should to delete a component by params');
		describe('byId',function(){
			it('Should execute successfuly');
			it('Should return not found if the id is not valid');
			it('Should return not found if the id is not found');
		});
	});

	after(function(done){
		utils.endServer(done);
	});
});