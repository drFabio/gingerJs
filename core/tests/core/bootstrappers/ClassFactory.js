/**
 * Suite of tests for the ginger class factory
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var should = chai.should();
var ClassFactory=require(__dirname+'/../../bootstraps/ClassFactory');
var appDir=__dirname+'/../../exampleApplication/';
describe('Class factory creation',function(){

	
	it('Should be able to set a file path for a class');
	it('Should be able to create a class from a file path');
	it('Should be able to create a object from a class');
	it('Should be able to create a object that inherits from a class');
	it('Should be able to get a file path');
	it('Should be able to get a class');
	it('Should be able to get a Object');
	it('Should be able to create singleton Object');
	it('Should be able to create non singleton Object');
	it('Should be able to load a parent if it\'s not yet loaded');
	it('Should be able to set a namespace directory').
	it('Should be able to create a class within a namespace');
	it('Should be able to have the same class name in different namespaces');
	it('Should fail if you try to overwrite a namespace');
	it('Should fail if you try to load an unexistent class');
	it('Should be able to create a class from a POJO object');
});
