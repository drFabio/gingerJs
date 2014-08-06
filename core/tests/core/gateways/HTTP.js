var chai=require('chai');
var expect=chai.expect;
var should = chai.should();
var http=require('http');
var host='localhost';
var port=3000;
var Ginger=require(__dirname+'/../../../Ginger.js');

var httpHelper=require(__dirname+'/../tools/http')(host,port);
describe('Gateway',function(){
	var ginger;
	//Initializing the app by path first
	before(function(done){
		ginger=new Ginger();
		ginger.setAppPath(__dirname+'/../../exampleApplication/');
		ginger.up(done);
	});
	describe.only('HTTP',function(){
		it('Should send an html response on success',function(done){
			httpHelper.sendGet('/hello/hello',null,function(err,data){
				expect(data.body).to.equal('Hello');
				done(err);
			});
		});
		it('Should respond with 404 in case of not found');
		it('Should respond with 500 in case of failure');
		
	});
	after(function(done){
		ginger.down(done);
	});
});