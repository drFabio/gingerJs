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
describe('AbstractSchema',function(){
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
		it('Should  validate simple rules',function(){
			var field='numHits';
			var ok=tagSchema.validateField(field,1234);
			expect(ok).to.be.true;
			var fail=tagSchema.validateField(field,'foo');
			expect(fail).to.be.false;
		});
		it('Should validate multiple rules',function(){
			var field='name';
			var ok=tagSchema.validateField(field,'shouldpass');
			expect(ok).to.be.true;
			var fail=tagSchema.validateField(field,'AAA');
			expect(fail).to.be.false;
			fail=tagSchema.validateField(field,1234);
			expect(fail).to.be.false;

		});
		it('Should validate complex rules',function(){
			var field='url';
			var ok=tagSchema.validateField(field,'http://google.com');
			expect(ok).to.be.true;
			ok=tagSchema.validateField(field,'https://google.com');
			expect(ok).to.be.true;
			/*var fail=tagSchema.validateField(field,'notAUrl');
			expect(fail).to.be.false;*/
		});
		it('Should validate a batch of values',function(){
			var fields={
				'numHits':3,
				'name':'foo',
				'url':'http://www.google.com'
			};
			expect(tagSchema.validate(fields)).to.be.true;
			var failed=false;
			try{
				var fields={
					'numHits':'saasas',
					'name':'foo',
					'url':'http://www.google.com'
				};
				tagSchema.validate(fields);

			}
			catch(err){
				failed=true;
				expect(err).to.exit;
				expect(err.code).to.equal('VALIDATION');
			}
			expect(failed).to.be.true;
		});
	});
	after(function(done){
		utils.endServer(done);
	});
});