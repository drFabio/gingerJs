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

		});
	
		it('Should send a view as JSONRPC');
		describe('Errors',function(){
			it('Should respond to error -32700 on Parse Error');
			it('Should respond to error -32600 on Invalid Request',function(done){

				httpHelper.sendPost('/JSONRPC/hello',{'method':'hello'},function(err,data){
					if(err){
						done(err);
						return;
					}
					var response=JSON.parse(data.body);
					var statusCode=data.status;
					expect(response.error).to.exist
					expect(response.error.code).to.equal('-32600');
					expect(statusCode).to.equal(200);
					done(err);
				});


			});
			it('Should respond to error -32601 on Method Not found',function(done){
				var postData={'method':'dontExist',"id":"1234"};
				httpHelper.sendPost('/JSONRPC/hello',postData,function(err,data){
					if(err){
						done(err);
						return;
					}
					var response=JSON.parse(data.body);
					var statusCode=data.status;
					expect(response.error).to.exist
					expect(response.error.code).to.equal('-32601');
					expect(statusCode).to.equal(200);
					done(err);
				});


			});
			it('Should respond to error -32001 on Forbidden',function(done){
				var postData={'method':'hello',"id":"1234"};
				httpHelper.sendPost('/JSONRPC/restricted',postData,function(err,data){
					if(err){
						done(err);
						return;
					}
					var response=JSON.parse(data.body);
					var statusCode=data.status;
					expect(response.error).to.exist
					expect(response.error.code).to.equal('-32001');
					expect(statusCode).to.equal(200);
					done(err);
				});


			});

			it('Should respond to error -32602 on Invalid Params');
			it('Should respond to error -32603 on Internal error');


		});
		describe('Login',function(){
			it('Should not be able to login with the wrong password',function(done){
				var data={
					'[user]':'notTheRightUser',
					'[password]':'irrelevant'
				};
				var cb=function(err,data){
					expect(err).to.exist;
					expect(err.code).to.equal('-32001');
					done();
				}
				httpHelper.sendJSONRpc('/JSONRPC/authentication','login',1234,data,cb);
			});
			it('Should be able to login with the right password',function(done){
				var data={
					'[user]':'foo',
					'[password]':'bar'
				};
				var cb=function(err,data){
					expect(err).to.not.exist;
					expect(data.name).to.equal('johnson');

					expect(data.email).to.equal('johnson@johnson.com');
					done();
				}
				httpHelper.sendJSONRpc('/JSONRPC/authentication','login',1234,data,cb);
			});
			it('Should be able to logout',function(done){
				var cb=function(err,data){
					expect(err).to.not.exist;
					expect(data).to.equal('success');
					done();
				}
				httpHelper.sendJSONRpc('/JSONRPC/authentication','logout',1234,{},cb);
			});
		});
		after(function(done){
			ginger.down(done);
		});
	
});
