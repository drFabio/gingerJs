var chai=require('chai');
var expect=chai.expect;
var should = chai.should();
var http=require('http');
var host='localhost';
var port=3000;
var Ginger=require(__dirname+'/../../../Ginger');

describe('Gateway JsonRPC',function(){
	var httpHelper=require(__dirname+'/../../tools/http')(host,port);
		before(function(done){
			ginger=new Ginger();
			ginger.setAppPath(__dirname+'/../../exampleApplication/');
			ginger.up(done);
		});

		it('Should execute the request sucessfully',function(done){

			httpHelper.sendPost('/JSONRPC/hello',{'method':'hello','id':'1234'},function(err,data){
				if(err){
					done(err);
					return;
				}
				var response=JSON.parse(data.body);
				var statusCode=data.status;

				expect(response.id).to.equal('1234');


				expect(response.result).to.equal('Hello');
				expect(statusCode).to.equal(200);
				done(err);
			});
;
		});
	
		it('Should send a view as JSONRPC');
		describe('Errors',function(){
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
