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
		var populate={'populated':'name _id'};

		var query=ginger.getQuery(search,field,option,populate);
		expect(_.isEqual(query._search,search)).to.be.true;
		expect(_.isEqual(query._field,field)).to.be.true;
		expect(_.isEqual(query._option,option)).to.be.true;
		for(var k in populate){
			expect(query._populate[k].path).to.equal(k);
			expect(query._populate[k].select).to.equal(populate[k]);
		}
		done();
	});
	describe('Population',function(){
	});
	after(function(done){
		utils.endServer(done);
	});
});