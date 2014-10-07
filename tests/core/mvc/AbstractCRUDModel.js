var databaseComponent;
var createObjectId = require('pow-mongodb-fixtures').createObjectId;
var _=require('lodash');
var async=require('async');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var fixtures=utils.fixtures;
var	dbFixtureData=utils.getFixtureData('categories','login');

describe('AbstractCRUDModel',function(){
	var ginger;
	//Initializing the app by path first
	before(function(done){
		var cb=function(err){
			if(err){
				done(err);
				return;
			}
			ginger=utils.getServer();
			var fixtures=utils.fixtures;
			databaseComponent=ginger.getComponent('DataBase');

			fixtures.clearAndLoad(dbFixtureData,function(err,data){
				done();

			});
		}
		utils.initServer(cb);
	});
	describe('Read',function(){
		describe('Populations',function(){
			it.skip('Should be able to set fields to populate on the fields part',function(done){
				var fields={'user.email':true,'user.active':true};
				var id=dbFixtureData.categories.forDevelopers._id.toString();
				var model=ginger.getModel('categories');
				var readCb=function(err,data){
					expect(err).to.not.exist;
					done();
				}
				model.readById(id,readCb,fields);
			});
		});
	});	
	describe('List',function(){
		it('Should be able to set the default Fields to list',function(done){
			var model=ginger.getModel('categories');
			var checkIfDefaultFieldsApplyed=function(err,result){
				expect(err).to.not.exist;
				expect(result.total).to.be.above(0);
				expect(result).to.exist;
				expect(result.results).to.exist;
				var fields=model._getDefaultFields();
				result.results.forEach(function(r){
					for(var k in fields){
						if(fields[k]){
							expect(r[k]).to.exist;

						}
						else{
							expect(r[k]).to.not.exist;
						}

					}
				});
				done();	
				
			}
			model.list({},false,null,null,null,checkIfDefaultFieldsApplyed);

		});
	});
	describe('AbstractCRUDModel',function(){
		describe('Save',function(){
			before(function(done){
				fixtures.clearAndLoad(dbFixtureData,done);
			});
			it('Should save a new data if no primary key is specified',function(done){
				var data={
					'email':'theEmail@gmail.com',
					'active':true,
					'name':'theName',
					'password':'thePassword',
				};
				var model=ginger.getModel('login');
				model.save(data,function(err,saveData){
					for(var x in data){
						expect(saveData[x]).to.equal(data[x]);
					}
					expect(saveData._id).to.exist;
					done();
				});
			});
			it('Should  update data the existing data if the primary key is specified',function(done){
				var model=ginger.getModel('login');
				var updateData=dbFixtureData.login.user1;
				var newEmail='newEmailForSaved@gmail.com';
				var data={
					'email':newEmail,
					'_id':updateData._id.toString()
				};
				var sameKeys=['active','name','password'];
				model.save(data,function(err,saveData){
					sameKeys.forEach(function(s){
						expect(saveData[s]).to.equal(updateData[s]);
					});

					expect(saveData._id.toString()).to.equal(updateData._id.toString());
					expect(saveData.email).to.equal(newEmail);
					done();
				});
			});
			
		});
		
		describe('Validate',function(){
			/*it('Should validate data before inserting',function(done){

			});
			it('Should validate data before updating');*/
		});
	});
	after(function(done){
		utils.endServer(done);
	});
});