var databaseComponent;
var createObjectId = require('pow-mongodb-fixtures').createObjectId;
var _=require('lodash');
var async=require('async');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var fixtures=utils.fixtures;
var fixtureData;

describe.only('Component database',function(){
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
			fixtureData=utils.getFixtureData('login');
			done();

		}
		utils.initServer(cb);
	});
	beforeEach(function(done){
		fixtures.clearAndLoad(fixtureData,done);
	});
	describe('readById',function(){
		describe('Failure',function(){
			it('Should return not found if the id is not valid ',function(done){
				databaseComponent.readById('login','NotRelevant',function(err,data){
					expect(err).to.exist;
					expect(err.code).to.equal('NOT_FOUND');
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
	describe('Read',function(){
	});
	describe('Read one',function(){
	});
	describe('Create',function(){
		describe('Failure',function(){
			describe('Validation',function(){
			});
			it('Should not be able to create  without required fields');
		});
		describe('Success',function(){
			it('Should successfuly create',function(done){
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
	});
	describe('Update',function(){
	});
	describe('Destroy ',function(){
	});

	after(function(done){
		utils.endServer(done);
	});
});