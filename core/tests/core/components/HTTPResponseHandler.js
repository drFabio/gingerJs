var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var Ginger=require(__dirname+'/../../../Ginger.js');
var should = chai.should();var ginger=new Ginger();
var fakeRes={

};
describe("HTTPResponseHandler",function(){
	before(function(done){
		ginger.up(done);

	});
	it('Should convert GET and POST to the same vars',function(){

	});
	after(function(done){
		ginger.down(done);
	});
});