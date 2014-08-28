var _=require('lodash');
var async=require('async');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var schemaFactory;
var ginger;
/**
 * @todo  move tests to some kind of fixture
 */
describe('Schema Factory',function(){
	//Initializing the app by path first
	before(function(done){
		ginger=utils.getServer();
		ginger._setup(function(err,data){
			if(err){
				done(err);
				return;
			}
			schemaFactory=ginger.getBootstrap('SchemaFactory');
			done();
		})
	});
	describe('Add schema',function(){
		it('Should be able to add a normal one',function(done){
			var path=utils.appDir+'/models/schemas/login.js';
			var namespace=schemaFactory.setAppClass('login',path);
			expect(namespace).to.equal('schemas.login');
			done();
		});
		it('Should be able to add a complex one',function(done){
			var path=utils.appDir+'/models/schemas/tags.js';
			var namespace=schemaFactory.setAppClass('tags',path);
			expect(namespace).to.equal('schemas.tags');
			done();
		});
		it('Should be able to add a incomplete one ',function(done){
			var path=utils.appDir+'/models/schemas/posts.js';
			var namespace=schemaFactory.setAppClass('posts',path);
			expect(namespace).to.equal('schemas.posts');
			done();
		});
		it('Should be able to add a schema, remove it and then add it again',function(done){
			var expectedNamespace='schemas.categories';
			var path=utils.appDir+'/models/schemas/categories.js';
			var namespace=schemaFactory.setAppClass('categories',path);
			expect(namespace).to.equal(expectedNamespace);
			var clear=schemaFactory._clearSchema('categories');
			expect(clear).to.be.true;
			var namespace=schemaFactory.setAppClass('categories',path);
			expect(namespace).to.equal(expectedNamespace);
			done();
		});
	});
	after(function(done){
		ginger.down(done);
	});

});
