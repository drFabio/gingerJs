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
var ginger;
var schemaFactory;
var tagSchema;
describe.only('AbstractSchema',function(){
	before(function(done){
			utils.initServer(function(err){
				if(err){
					done(err);
					return;
				}
				ginger=utils.getServer();
				schemaFactory=ginger.getBootstrap('SchemaFactory');
				tagSchema=schemaFactory.create('tags');
				done();
		});
	});
	describe('Validation',function(){
		it('Should  validate simple rules',function(done){
			var field='name';
			var ok=tagSchema.validateField(field,'theName');
			expect(ok).to.be.true;
			var fail=tagSchema.validateField(field,1234);
			expect(fail).to.be.false;
			done();
		});
		it('Should validate multiple rules');
		it('Should validate complex rules');
		it('Should validate a batch of values');
	});
	after(function(done){
		utils.endServer(done);
	});
});