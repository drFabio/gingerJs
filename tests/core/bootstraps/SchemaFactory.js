var _=require('lodash');
var async=require('async');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var schemaFactory;
var ginger;
var addSchemaSucessfully=function(name){
	var path=utils.appDir+'/models/schemas/'+name+'.js';
	var namespace=schemaFactory.setAppClass(name,path);
	expect(namespace).to.equal('schemas.'+name);
	var obj=schemaFactory.create(name);
	obj.setup();
	return obj;
}
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
		});
	});
	describe('Add schema',function(){
		it('Should be able to add a normal one',function(done){
			addSchemaSucessfully('login');
			done();
		});
		it('Should be able to add a complex one',function(done){
			addSchemaSucessfully('tags');
			done();
		});
		it('Should be able to add a incomplete one ',function(done){
			addSchemaSucessfully('posts');
			done();
		});
		it('Should be able to add a schema initialize it remove it and then add it again',function(done){
			var obj=addSchemaSucessfully('categories');
			obj.clearSchema(function(err){
				if(err){
					cb(err);
					return;
				}
				obj.setup();
				done();
			});
		});
		it('Should create a empty schema if one is not defined',function(done){
			var obj=schemaFactory.create('nonExistantSchema');
			expect(obj).to.exist;
			done();
		});
	});
	after(function(done){
		ginger.down(done);
	});

});
