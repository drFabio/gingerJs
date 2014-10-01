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
describe.only('DefaultQuery',function(){
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
		var populate={'populated':'name _id'};

		var query=ginger.getQuery(search,field,option,populate);
		expect(_.isEqual(query._search,search)).to.be.true;
		expect(_.isEqual(query._field,field)).to.be.true;
		expect(_.isEqual(query._option,option)).to.be.true;
		for(var k in populate){
			expect(query._populate[k].path).to.equal(k);
			var populateParts=query._getSelectPartFromString(populate[k]);
			expect(_.isEqual(query._populate[k].select,populateParts)).to.equal(true);
		}
		done();
	});
	describe('Population',function(){
		it('Should be able to set population from a field,while respecting both field and population',function(done){
			var field={
				'populated.someField':{'foo':true,'bar':true,'baz':true},
				'normalField':'bar'
			}
			var populate={
				'anotherPopulated':'name _id enabled',
				'populated':'someOtherField'
				
			}
			var query=ginger.getQuery(null,field,null,populate);
			console.log(query._populate);
			for(var k in field){
				if(k.indexOf('.')>-1){
					var parts=k.split('.');
					expect(query._populate[parts[0]]).to.exist;
					expect(query._populate[parts[0]].select[parts[1]]).to.equal(field[k]);
				}
				else{

					expect(query._field[k]).to.equal(field[k]);
				}
			}
			for(var k in populate){
				expect(query._populate[k].path).to.equal(k);
				var populateParts=query._getSelectPartFromString(populate[k]);
				for(var populateKey in populateParts){

					expect(query._populate[k].select[populateKey]).to.equal(populateParts[populateKey]);
				}
			}
			done();
		});
	});
	after(function(done){
		utils.endServer(done);
	});
});