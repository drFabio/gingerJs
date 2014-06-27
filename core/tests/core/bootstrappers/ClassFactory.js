/**
 * Suite of tests for the ginger
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var should = chai.should();
var ClassFactory=require(__dirname+'/../../bootstraps/ClassFactory');
var appDir=__dirname+'/../../exampleApplication/';
describe('Class factory creation',function(){

	
	it('Should be able to set a file path',function(){

	});
	it('Should be able to set a class');
	it('Should be able to set a Object');
	it('Should be able to get a file path');
	it('Should be able to get a class');
	it('Should be able to get a Object');
	it('Should be able to create singleton Object');
	it('Should be able to create non singleton Object');
	it('Should be able to have a fallback order to load data');
});
