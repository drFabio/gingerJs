var chai=require('chai');
var expect=chai.expect;
var http = require("http");
var should = chai.should();
var host='localhost';
var port=3000;
var httpHelper=require(__dirname+'/../tools/http')(host,port);

describe.only('Gateway JsonRPC',function(){
		before(function(done){
			ginger=new Ginger();
			ginger.setAppPath(__dirname+'/../../exampleApplication/');
			ginger.up(done);
		});

		it('Should respond with the same Id',function(){
			httpHelper.sendPost('/hello',{'method':'hello','id':'1234'},function(err,data){
				console.log(data);
			});
		});
		it('Should  allow JSONRPC queries',function(){

		});
		it('Should send a view as JSONRPC');
		describe('Errors',function(){
			it('Should proxy to the right controller and action');
			it('Should respond to error -32700 on Parse Error');
			it('Should respond to error -32600 on Invalid Request');
			it('Should respond to error -32601 on Method Not found');
			it('Should respond to error -32602 on Invalid Params');
			it('Should respond to error -32603 on Internal error');
		});
		after(function(done){
			ginger.down(done);
		});
	
});
