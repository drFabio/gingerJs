var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var Ginger=require(__dirname+'/../../Ginger.js');
var should = chai.should

describe('Application',function(){
	var ginger;
	describe('up() \'by path\'',function(){
		//Initializing the app by path first
		before(function(done){
			ginger=new Ginger();
			ginger.setAppPath(__dirname+'/../exampleApplication/');
			ginger.up(done);
		});
		it('Should have the config by the application',function(){
			expect(ginger.getConfig().name).to.equal("Example");
		});
		
		it.skip('Should have loaded all the modules',function(){
			expect(ginger.hasModule('sum')).to.be.true;
			expect(ginger.hasModule('sum.multiplication')).to.be.true;
		});
		
		it('Should have loaded all controllers',function(){
			expect(ginger.hasController('hello')).to.be.true;
			expect(ginger.hasController('sum.index')).to.be.true;
			expect(ginger.hasController('sum.multiplication.index')).to.be.true;

		});
		it('Should have loaded all models',function(){
			expect(ginger.hasModel('hello')).to.be.true;
			expect(ginger.hasModel('sum.index')).to.be.true;
			expect(ginger.hasModel('sum.multiplication.index')).to.be.true;

		});
		it('Should overwrite a gateway without needing to config',function(){
			expect(ginger.getGateway('HTTP').iAmOverwritten).to.be.true;
		});
		it('Should be able to overwride a component',function(){
			ginger.getComponent('Log',function(err,component){
				expect(component.iAmOverwritten).to.be.true;
			});
		});

		describe('Error',function(){
			
			it('Should be able to overwritte errors',function(){
				var error=ginger.getError('NotFound');
				expect(error.iAmOverwritten).to.be.true;
			});

		});
		describe('Model',function(){
			it('Should be able to get a model by name',function(){
				var model=ginger.getModel('Hello');
				expect(model).to.be.an('object');
				expect(model).to.not.be.an('undefined');
				expect(model).to.exist;
				expect(model.sayHello()).to.equal('Hello');
			});
			it('Should be able to get a nested model by name',function(){
				var model=ginger.getModel('sum.index');
				expect(model).to.be.an('object');
				expect(model).to.not.be.an('undefined');
				expect(model).to.exist;
				expect(model.sum(1,2)).to.equal(3);
			});
		});
		describe('Controller',function(){
				it('Should be able to inherits the default controller');
				it('Should have a defaultModel if it exist');
				it('Should create the avaiable actions');
				it('Should have Crud Avaiable');
		});
		after(function(done){
			ginger.down(done);
		});
	});
});
