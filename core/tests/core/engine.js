/**
 * Suite of tests for the ginger
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var Ginger=require(__dirname+'/../../Ginger.js');
var should = chai.should();

describe('engine',function(){
	describe('vanilla setup',function(){
		var ginger=new Ginger();
		it('Should go up smoothly',function(done){
			ginger.up(done);
		});
		it('should have a default config',function(){
				expect(ginger._config).not.to.be.empty;
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
		});
		describe('component',function(){
			it('Should Have the default componets',function(done){
				
				var getComponentCb=function(err,component){

					expect(component).to.exist;
					done(err);
				}
				ginger.getComponent('Express',getComponentCb);
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
			var preLaunch=function(ginger,cb){
				cb();
			};
			ginger.setPreLaunchFunction(preLaunch);
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
					'DataBase':false
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
					expect(ginger.isComponentCancelled('DataBase')).to.be.true;
				});
			});

			describe('#gateway',function(){
				it('Should be able to remove a gateway by setting it to false',function(){
					var gateway=ginger.isGatewayCancelled('HTTP');
					expect(gateway).to.be.true;
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
	describe('Error',function(){
		var ginger=new Ginger();
		before(function(done){
			ginger.up(done);

		});
		it('Should have the default errors',function(){
			var errors=['Default','Internal','Parse','InvalidParams','InvalidRequest','NotFound','Validation'];
			for(var x in errors){
				expect(ginger.getError(errors[x])).not.empty;
				expect(ginger.getError(errors[x]).code).not.empty;
				expect(ginger.getError(errors[x]).message).not.empty;

			}
		});
		after(function(done){
			ginger.down(done);
		});
	});

	
});