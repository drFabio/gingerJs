/**
 * Suite of tests for the ginger class factory
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var should = chai.should();
var appDir=__dirname+'/../../exampleApplication/';
var gingerRootDir=__dirname+'/../../../';
var ClassFactory=require(gingerRootDir+'/bootstraps/ClassFactory');
describe('Class factory creation',function(){
	var classFactory;
	before(function(){
		classFactory=new ClassFactory();
	});
	it('Should be able to set a namespace directory',function(){
		expect(classFactory.setNamespaceDir('ginger',gingerRootDir)).to.be.true;
	});
	it('Should be able to set a file path for a class',function(){
		expect(classFactory.setClassFile('ginger.AbstractGateway',gingerRootDir+'/gateway/AbstractGateway')).to.be.true;
	});
	it('Should be able to create a class from a previously set file path',function(){
		expect(classFactory.getClass('ginger.AbstractGateway')).to.not.be.empty;

	});
	it('Should be able to get a object from a previously loaded class',function(){
		var gatewayObj=classFactory.getObject('ginger.AbstractGateway',null,null,function(){});
		expect(gatewayObj).to.not.be.empty;
	});
	it('Should be able to apply function arguments',function(){
		var gatewayObj=classFactory.getObject('ginger.AbstractGateway',null,null,function(){});
		expect(gatewayObj).to.not.be.empty;
	});
	it('Should be able to create a object that inherits from a class');
	it('Should be able to get a file path');
	it('Should be able to get a class');
	it('Should be able to get a Object');
	it('Should be able to create singleton Object');
	it('Should be able to create non singleton Object');
	it('Should be able to load a parent if it\'s not yet loaded');
	it('Should be able to create a class within a namespace');
	it('Should be able to have the same class name in different namespaces');
	it('Should fail if you try to overwrite a namespace');
	it('Should fail if you try to load an unexistent class');
	it('Should be able to create a class from a POJO object');
});
