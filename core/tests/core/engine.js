/**
 * Suite of tests for the ginger
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var Ginger=require(__dirname+'/../../Ginger.js');
var should = chai.should();

describe('Ginger',function(){
	describe('vanilla setup',function(){
		var ginger=new Ginger();
		it('Should go up smoothly',function(done){
			ginger.up(done);
		});
		it('should have a default config',function(){
				expect(ginger._config).not.to.be.empty;
		});
		describe('component',function(){
			it('Should Have the defualt componets',function(done){
				
				var getComponentCb=function(err,component){

					expect(component).to.exist;
					done(err);
				}
				ginger.getComponent('Express',getComponentCb);
			});
		
		});
		describe('gateway',function(){
			it('Should have the default gateways',function(){
				
					var gateway=ginger.getGateway('HTTP');
					expect(gateway).to.exist;
					gateway=ginger.getGateway('JSONRPC');
					expect(gateway).to.exist;
					gateway=ginger.getGateway('SocketIO');
					expect(gateway).to.exist;
					

			});
		});
		it('Should go down smoothly',function(done){
			ginger.down(done);
		});
		
	});
	describe('preLaunch',function(){
		it('Should not run if preLaunch throws an error',function(done){
			var ginger=new Ginger();
			var preLaunch=function(ginger,cb){
				cb(new Error('don\'t start'));
			};
			ginger.setPreLaunchFunction(preLaunch);
			ginger.up(function(err){
				expect(err).to.exist;
				ginger.down(done);
			});

		});
		it('Should  run if prelaunch allows',function(done){
			var ginger=new Ginger();
			/*var preLaunch=function(ginger,cb){
				cb();
			};
			ginger.setPreLaunchFunction(preLaunch);*/
			ginger.up(function(err){
				expect(err).to.not.exist;
				ginger.down(done);
			});

		});
	});


	// it('Should fail if you give a required connection');
	describe('#config',function(){
		describe('#custom',function(){
			var ginger=new Ginger();

			var exampleConfig={
				'myVar':'foo',
				'components':{
					'db':false
				},
				'gateways':{
					'HTTP':false
				}


			};
			before(function(done){
				ginger.setConfig(exampleConfig);
				ginger.up(done);

			});
			it('Add data to the config',function(){
					expect(ginger._config).not.to.be.empty;
					expect(ginger._config['myVar']).to.equal('foo');
			});

			describe('#component',function(){
				it('Should be able to remove a component by setting it to false',function(){
					expect(ginger.isComponentCancelled('db')).to.be.true;
				});
			});

			describe('#gateway',function(){
				it('Should be able to remove a gateway by setting it to false',function(){
					var gateway=ginger.getGateway('HTTP');
					expect(gateway).to.not.exist;
				});
			});

			after(function(done){
				ginger.down(done);
			});

		});

	});

	describe('component',function(){
		var ginger=new Ginger();
		before(function(done){
			ginger.up(done);

		});
		it('Should overwritte a component after it\'s loaded by setting the component',function(done){
			
			var getComponentCb=function(err,component){
				if(err){
					done(err);
					return;
				}
				expect(component).to.exist;
				ginger.setComponent('Log',{'foo':'bar'});
				ginger.getComponent('Log',function(err,component){
					expect(component.foo).to.equal('bar');
					done(err);
				});

			}
			ginger.getComponent('Log',getComponentCb);
			
		});
		after(function(done){
			ginger.down(done);
		});
	});
	describe('gateway',function(){
		it('Should give the same Reponse content independant of the gateway');
	});
	describe('Error',function(){
		var ginger=new Ginger();
		before(function(done){
			ginger.up(done);

		});
		it('Should have the default errors');
		it('Should be able to overwritte the errors behaviours');
		after(function(done){
			ginger.down(done);
		});
	});
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
				expect(ginger.hasController('Hello')).to.be.true;
				expect(ginger.hasController('sum/Index')).to.be.true;
				expect(ginger.hasController('sum/multiplication/Index')).to.be.true;

			});
			it('Should have loaded all models',function(){
				expect(ginger.hasModel('Hello')).to.be.true;
				expect(ginger.hasModel('sum/Index')).to.be.true;
				expect(ginger.hasModel('sum/multiplication/Index')).to.be.true;

			});
			it.skip('Should overwrite a gateway without needing to config',function(){
				expect(ginger.getGateway('HTTP').iAmOverwritten).to.be.true;
			});
			it('Should overwrite a component without needing to config');

			after(function(done){
				ginger.down(done);
			});
		});

	});
	
	describe('Controller',function(){
		it('Should be able to inherits the default controller');
		it('Should have a defaultModel if it exist');
		it('Should create the avaiable actions');
		it('Should have Crud Avaiable');
	});
		
});