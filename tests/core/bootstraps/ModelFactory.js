var _=require('lodash');
var async=require('async');
var Utils=require('../../tools/utils');
var utils=new Utils();
var expect=utils.expect;
var should = utils.should;
var modelFactory;
var ginger;
var addModelSuccessfully=function(name){
	var path=utils.appDir+'/models/'+name+'.js';
	var namespace=modelFactory.setAppClass(name,path);
	expect(namespace).to.equal('models.'+name);
	var obj=modelFactory.create(name);
	return obj;
}
/**
 * @todo  move tests to some kind of fixture
 */
describe('Model Factory',function(){
	//Initializing the app by path first
	before(function(done){
		ginger=utils.getServer();
		ginger._setup(function(err,data){
			if(err){
				done(err);
				return;
			}
			modelFactory=ginger.getBootstrap('ModelFactory');
			done();
		});
	});
	describe('Events',function(){
		it('Should be able to set a model as event emmiter',function(done){
			var obj=addModelSuccessfully('Event');
			expect(obj).to.exist;
			var testName='bar';
			obj.on('foo',function(){
				obj.callHello(testName);
			});
			obj.on('hello',function(helloName){
				expect(helloName).to.equal('Hello '+testName);
				done();
			});
			obj.emit('foo');
		});
	});
	after(function(done){
		ginger.down(done);
	});

});
