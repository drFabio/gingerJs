var chai=require('chai');
var expect=chai.expect;
var should = chai.should();
var http=require('http');
var host='localhost';
var port=3000;
var Ginger=require(__dirname+'/../../../Ginger.js');

var httpHelper=require(__dirname+'/../tools/http')(host,port);
describe.skip('Gateways HTTP ',function(){
	var ginger;
	//Initializing the app by path first
	before(function(done){
		ginger=new Ginger();
		ginger.setAppPath(__dirname+'/../../exampleApplication/');
		ginger.up(done);
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
		})		
	});
	after(function(done){
		ginger.down(done);
	});
});