var Ginger = require(__dirname+'/../../Ginger');
var appDir=__dirname+'/../exampleApplication';
/**
 * @todo get this from the joined config file
 */
var config=require(appDir+'/config/app');
var dbName=config.components.DataBase.mongo.base;
var host='localhost';
var port=3000;
var powDbFixtures=require('pow-mongodb-fixtures');

var fixtures = powDbFixtures.connect(dbName);
var fixtureDir=__dirname+'/../fixtures/';
//var prefix=config.gateways.JSONRPC.prefix;
var chai=require('chai');
var expect=chai.expect;
var should = chai.should();
var _=require('lodash');
chai.config.includeStack =true;


var httpHelper=require('./http')(host,port);

function Utils(){
	this._ginger=new Ginger();
	this._ginger.setAppPath(appDir);
	this.jsonRpcErrors={
		'invalidParams':'-32602',
		'notFound':'-32001'
	};
	this.createObjectId=powDbFixtures.createObjectId;
	this.chai=chai;
	this.appDir=appDir;
	this.expect=expect;
	this.should=should;
	this.fixtures=fixtures;
	this.httpHelper=httpHelper;
	this.appConfig=config;
}
Utils.prototype.initServer = function(cb) {
	this._ginger.up(cb);
};
Utils.prototype.endServer = function(cb) {
	this._ginger.down(cb);
};
Utils.prototype.getServer=function(){
	return this._ginger;
}
Utils.prototype.getFixtureData = function(var_args) {
	var ret={};
	for(var k in arguments){
		ret=_.extend(ret,require(fixtureDir+arguments[k]))
	}
	return ret;
};
module.exports=Utils;