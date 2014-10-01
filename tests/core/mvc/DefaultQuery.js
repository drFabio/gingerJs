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
var ginger;
var queryFactory;
var comparePopulate=function(query,inputPopulate){
	if(typeof(inputPopulate)=='string'){
		expect(query._populate[inputPopulate]).to.exist;
		expect(query._populate[inputPopulate].path).to.equal(inputPopulate);
		return;
	}
	for(var k in inputPopulate){
		if(typeof(inputPopulate[k])=='string'){
			expect(query._populate[k].path).to.equal(k);
			var populateParts=query._getSelectPartFromString(inputPopulate[k]);
			for(var populateKey in populateParts){
				expect(query._populate[k].select[populateKey]).to.equal(populateParts[populateKey]);
			}
		}
		else{
			for(fieldKey in inputPopulate[k]){
				if(_.isObject(inputPopulate[k][fieldKey])){
					var isEqual=_.isEqual(query._populate[k][fieldKey],inputPopulate[k][fieldKey]);
					expect(isEqual).to.be.true;
				}
				else{

					expect(query._populate[k][fieldKey]).to.equal(inputPopulate[k][fieldKey]);
				}
			}
		}
	}
}
describe('DefaultQuery',function(){
	before(function(done){
		utils.initServer(function(err){
			if(err){
				done(err);
				return;
			}
			ginger=utils.getServer();
			done();
		});
	});

	it('Should be able to set the normal options ',function(done){
		var search={'fieldA':'equal comething'};
		var field={'fieldB':true,'fieldC':true};
		var option={'sort':{'name':1}};;
		var populate={'populated':'name _id','fullPopulated':{'path':'fullPopulated','select':{'bar':true}}};

		var query=ginger.getQuery(search,field,option,populate);
		expect(_.isEqual(query._search,search)).to.be.true;
		expect(_.isEqual(query._field,field)).to.be.true;
		expect(_.isEqual(query._option,option)).to.be.true;
		comparePopulate(query,populate);
		done();
	});
	describe('Population',function(){
		it('Should be able to set populate as a string',function(done){
			var populate='something';
			var query=ginger.getQuery(null,null,null,populate);
			comparePopulate(query,populate);
			done();
		});
		it('Should be able to set population from a field,while respecting both field and population',function(done){
			var field={
				'populated+someField':{'foo':true,'bar':true,'baz':true},
				'normalField':'bar'
			}
			var populate={
				'anotherPopulated':'name _id enabled',
				'populated':'someOtherField'
				
			}
			var query=ginger.getQuery(null,field,null,populate);
			for(var k in field){
				if(k.indexOf('+')>-1){
					var parts=k.split('+');
					expect(query._populate[parts[0]]).to.exist;
					expect(query._populate[parts[0]].select[parts[1]]).to.equal(field[k]);
				}
				else{

					expect(query._field[k]).to.equal(field[k]);
				}
			}
			comparePopulate(query,populate);
			done();
		});
		it('Should be able to set population from a option, while respecting both option and population',function(done){
			var options={
				'sort':{'name':1},
				'populated+limit':5,
				'populated+sort':{'name':-1},
				'someOtherField+limit':10
			}
			var populate={
				'populated':'someOtherField',
				'yetAnotherPopulation':'foo bar baz'
			}
			var query=ginger.getQuery(null,null,options,populate);
			for(var k in options){
				var value=options[k];
				if(k.indexOf('+')>-1){
					var parts=k.split('+');
					expect(query._populate[parts[0]]).to.exist;
					if(_.isObject(value)){
						expect(_.isEqual(query._populate[parts[0]].options[parts[1]],value)).to.be.true;
					}
					else{
						expect(query._populate[parts[0]].options[parts[1]]).to.equal(value);
					}
				}
				else{

					expect(_.isEqual(query._option[k],value)).to.be.true;
				}
			}
			comparePopulate(query,populate);
			done();
		});
		it('Should be able to set population from a search, while respecting both search and population',function(done){
			var search={'fieldA':'equal comething','populated+fieldB':14};
			var populate={
				'populated':'someOtherField'
			}
			var query=ginger.getQuery(search,null,null,populate);
			for(var k in search){
				var value=search[k];
				if(k.indexOf('+')>-1){
					var parts=k.split('+');
					expect(query._populate[parts[0]]).to.exist;
					if(_.isObject(value)){
						expect(_.isEqual(query._populate[parts[0]].match[parts[1]],value)).to.be.true;
					}
					else{
						expect(query._populate[parts[0]].match[parts[1]]).to.equal(value);
					}
				}
				else{

					expect(_.isEqual(query._search[k],value)).to.be.true;
				}
			}
			comparePopulate(query,populate);

			done();
		});

	});
	after(function(done){
		utils.endServer(done);
	});
});