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
		it('Should have the config by the application');
		
		it('Should have loaded all the modules',function(){
			expect(ginger.hasModule('sum')).to.be.true;
			expect(ginger.hasModule('sum/multiplication')).to.be.true;
		});
		
		it('Should have loaded all controllers',function(){
			expect(ginger.hasController('hello')).to.be.true;
			expect(ginger.hasController('sum/index')).to.be.true;
			expect(ginger.hasController('sum/multiplication/index')).to.be.true;

		});
		it('Should have loaded all models',function(){
			expect(ginger.hasModel('hello')).to.be.true;
			expect(ginger.hasModel('sum/index')).to.be.true;
			expect(ginger.hasModel('sum/multiplication/index')).to.be.true;

		});
		it('Should overwrite a gateway without needing to config',function(){
			expect(ginger.getGateway('HTTP').iAmOverwritten).to.be.true;
		});
		it('Should overwrite a component without needing to config');

		after(function(done){
			ginger.down(done);
		});
	});
});
describe('Error',function(){
	var ginger=new Ginger();
	before(function(done){
		ginger.up(done);

	});

	it('Should be able to overwritte errors');
	after(function(done){
		ginger.down(done);
	});
});
