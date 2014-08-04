var chai=require('chai');
var expect=chai.expect;
var should = chai.should();
descrin('Gateway',function(){
	describe('SocketIO',function(){
		it('Should proxy SocketIO queries to controller/action and respond to the same query');
		it('Should send a view as JSONRPC');
		it('Should proxy to the right controller and action');
		it('Should respond to error -32700 on Parse Error');
		it('Should respond to error -32600 on Invalid Request');
		it('Should respond to error -32601 on Method Not found');
		it('Should respond to error -32602 on Invalid Params');
		it('Should respond to error -32603 on Internal error');
		
	});
});
