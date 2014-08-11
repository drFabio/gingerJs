var chai=require('chai');
var expect=chai.expect;
var should = chai.should();
var http=require('http');
var host='localhost';
var port=3000;
var Ginger=require(__dirname+'/../../../Ginger.js');

describe('Gateways HTTP ',function(){
	var httpHelper=require(__dirname+'/../../tools/http')(host,port);
	var ginger;
	//Initializing the app by path first
	before(function(done){
		ginger=new Ginger();
		ginger.setAppPath(__dirname+'/../../exampleApplication/');
		var cb=function(err){
			if(err){
				done(err);
				return;
			}
			var fixtures = require('pow-mongodb-fixtures').connect('gingerTests');
			fixtures.clear(function(err) {
				done(err);
			});
		}
		ginger.up(cb);
	});
	describe('HTTP',function(){
		it('Should send an html response on success',function(done){
			httpHelper.sendGet('/hello/hello',null,function(err,data){
				expect(data.body).to.equal('Hello');
				done(err);
			});
		});
		it('Should respond with 404 in case of not found URL',function(done){
			httpHelper.sendGet('/URLthatDoesNotExists',null,function(err,data){
				if(err){
					done(err);
					return;
				}
				expect(data.status).to.equal(404);
				done();
			});
		});
		it('Should be able to pass params to the URL',function(done){
			httpHelper.sendGet('/sum/index/index',{a:1,b:4},function(err,data){
				expect(data.body).to.equal('5');
				done(err);
			});
		});

	});
	describe('CRUD',function(){
		
		it.skip('Should created routes for schemas without controller',function(done){
			var data={'data[email]':'email@email.com',
					'data[active]':true,
					'data[name]':'mr someone',
					'data[password]':'12345'};
			httpHelper.sendGet('/login/create',data,function(err,data){
				console.log('Data body');
				console.log(data);
				done(err);
			});
		});
	}),
	after(function(done){
		ginger.down(done);
	});
});