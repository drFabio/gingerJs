var mongoose=require('mongoose');
var _=require('lodash');
var async=require('async');
var DEFAULT_LIST_LIMIT=5;
module.exports={
	_isConnected:false,
	_isClosed:false,
	init: function(engine,params) {
		this._engine=engine;
		this._params=params;
		this._schemaFactory=engine.getBootstrap('SchemaFactory');
		if(!this._isConnected){
			this._isConnected=true;
			this._isClosed=false;
			var mongoConfig=this._params['mongo'];
			var uri=this._buildConection(mongoConfig.url,mongoConfig.port,mongoConfig.base);
			mongoose.connect(uri);
			this._addFunctionToClose();

			// CONNECTION EVENTS
			// When successfully connected
			mongoose.connection.on('connected', function () {
			});

			// If the connection throws an error
			mongoose.connection.on('error',function (err) {
				throw err;
			});
		}

	},
	_buildConection:function(url,port,base){
		return url+':'+port+'/'+base;

	},
	getSchemaClass:function(schemaName){
		return this._schemaFactory.createSchema(schemaName);
	},
	update:function(schemaName,data,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);
		options = { multi: true };

		Schema.update(searchData,data,options,cb);
	},
	updateById:function(schemaName,id,data,cb){
		var plainCb=this._getPlainObjectCb(cb,true);
		this.updateRawById(schemaName,data,id,plainCb);

	},
	updateRawById:function(schemaName,data,id,cb){
		var Schema=this.getSchemaClass(schemaName);
		var self=this;
		Schema.findByIdAndUpdate(id,data, function (err, schemaObj) {
			if (err) {

				cb(err);
				return;
			}
			cb(null,schemaObj);
		});

	},
	create:function(schemaName,data,cb){
		var self=this;
		var Schema=this.getSchemaClass(schemaName);
		var schemaObj=new Schema(data);
		schemaObj.save(function(err){
			self._getPlainObjectCb(cb)(err,schemaObj);
		});
	},
	_getPlainObjectCb:function(cb,notFoundIfEmpty){
		var self=this;
		return function(err,data){
			if(err){
				return cb(self._getErroFromMongooseError(err));
			}
			if(_.isEmpty(data)){
				if(notFoundIfEmpty){

					return cb(self._engine.getError('NotFound'));
				}
				return cb(null,data);
			}
			if(Array.isArray(data)){
				var ret=[];
				data.forEach(function(d){
					ret.push(d.toObject());
				});
				cb(null,ret);
			}

			if(data.toObject){
				return cb(null,data.toObject());
			}
		}
	},
	readRawById:function(schemaName,id,cb,fields,options){
		var Schema=this.getSchemaClass(schemaName);
		var search=Schema.findById(id);
		this._executeSearch(search,cb,fields,options);
	},
	readRaw:function(schemaName,searchData,cb,fields,options){
		var Schema=this.getSchemaClass(schemaName);
		var search=Schema.find(searchData);
		this._executeSearch(search,cb,fields,options);
	},
	readRawOne:function(schemaName,searchData,cb,fields){
		var Schema=this.getSchemaClass(schemaName);
		var search=Schema.findOne(searchData);
		this._executeSearch(search,cb,fields);
	},
	_getErroFromMongooseError:function(err){
		switch(err.name){
			case 'CastError':
				return this._engine.getError('InvalidParams','The sent id is not valid');
			break;
			default:
				return err;
			break;
		}

	},
	_executeSearch:function(search,cb,fields,options){
		if(!_.isEmpty(fields)){
			search.select(fields);
		}
		if(!_.isEmpty(options)){
			search.setOptions(options);
		}
		var self=this;
		var searchCb=function(err,data){
			if(err){
				cb(err);
				return;
			}
				cb(err,data);
		}
		search.exec(searchCb);

	},
	readById:function(schemaName,id,cb,fields){
		
		this.readRawById(schemaName,id,this._getPlainObjectCb(cb,true),fields);
	},
	read:function(schemaName,searchData,cb,fields,options){
		
		this.readRaw(schemaName,searchData,this._getPlainObjectCb(cb),fields,options);
	},
	readOne:function(schemaName,searchData,cb,fields){
		
		this.readRawOne(schemaName,searchData,this._getPlainObjectCb(cb,true),fields);
	},
	destroy:function(schemaName,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);
		Schema.remove(searchData,cb);
	},
	_addFunctionToClose:function(){
	 	var self=this
 	 	var func=function(cb){
	 		self.end();
	 		cb();
	 	}
		this._engine.addFunctionToCloseQueue(func);
	},
	end:function(){
		if(this._isConnected && !this._isClosed){

			this._isConnected=false;

			mongoose.connection.close();
			this._isClosed=true;
		}
	
	},
	list:function(schemaName,search,limit,page,fields,options,cb){
		if(parseInt(limit)===-1){
			limit=false;
		}
		else if(!limit || typeof(limit)=='undefined'){
			limit=DEFAULT_LIST_LIMIT;
		}
		if(!page || typeof(page)=='undefined'){
			page=0;
		}
		if(limit){
			if(!options){
				options={};
			}
			options.limit=limit;
			options.skip=limit*page;
		}
		var self=this;
		var read=function(asyncCb){
			self.read(schemaName,search,asyncCb,fields,options);

		};
		var total=function(asyncCb){
			self.count(schemaName,search,asyncCb);
		};
		async.parallel({
			'total':total,
			'results':read
		},cb);

	},
	count:function(schemaName,search,cb){
		var Schema=this.getSchemaClass(schemaName);
		if(search){
			Schema.count(search,cb);
		}
		else{
			Schema.count(cb);
		}
	}
}
